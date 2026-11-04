"""
MANAS-Assam / Tele-Raktim Full-Stack Production API Server
Provides Dual-Vault REST API Endpoints & Serves Static Frontend
Department of Health & Family Welfare, Government of Assam
"""

import os
import sys
import json
import base64
import random
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

# Add current dir to path
sys.path.append(os.path.dirname(__file__))
from database import init_db, get_connection, generate_case_id, mask_phone
from nlp_engine import analyze_transcript, scrub_pii, analyze_acoustic_biomarkers
from acoustic_engine import analyze_audio_bytes

# Determine root folder
STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

app = Flask(__name__, static_folder=STATIC_DIR)

# CORS setup
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# Serve Frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# ==============================================================================
# API: SYSTEM HEALTH & TELEMETRY
# ==============================================================================
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ONLINE",
        "platform": "Tele-Raktim Assam Hub",
        "state": "Assam",
        "data_centre": "Assam State Data Centre (SDC) On-Premise",
        "compliance": ["DPDP Act 2023", "Mental Healthcare Act 2017", "GIGW 3.0"],
        "timestamp": datetime.now().isoformat()
    })

# ==============================================================================
# API: ROLE-BASED AUTHENTICATION
# ==============================================================================
@app.route("/api/auth/citizen", methods=["POST"])
def auth_citizen():
    data = request.json or {}
    phone = data.get("phone", "+91 98640 12345")
    
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM citizens_identity_vault WHERE phone_masked LIKE ? OR phone_masked = ? LIMIT 1;", 
                (f"%{phone[-5:]}%", phone))
    row = cur.fetchone()
    
    if not row:
        token = f"TOKEN-TR-2026-{random.randint(1000, 9999)}"
        phone_masked = mask_phone(phone)
        cur.execute("""
            INSERT INTO citizens_identity_vault (citizen_token, full_name, phone_masked, phone_hash, email, district)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (token, "Verified Citizen", phone_masked, "hash_" + token, data.get("email"), "Kamrup Metropolitan"))
        conn.commit()
        cur.execute("SELECT * FROM citizens_identity_vault WHERE citizen_token = ?;", (token,))
        row = cur.fetchone()

    citizen_dict = dict(row)
    conn.close()

    return jsonify({
        "success": True,
        "role": "citizen",
        "token": citizen_dict["citizen_token"],
        "profile": {
            "name": citizen_dict["full_name"],
            "phone_masked": citizen_dict["phone_masked"],
            "district": citizen_dict["district"],
            "token": citizen_dict["citizen_token"]
        }
    })

@app.route("/api/auth/doctor", methods=["POST"])
def auth_doctor():
    data = request.json or {}
    email = data.get("email", "dr.ppdas.gmch@assam.gov.in")
    reg_no = data.get("reg_no", "AMC/REG/2012/8841")

    return jsonify({
        "success": True,
        "role": "doctor",
        "profile": {
            "name": "Dr. Partha Pratim Das, MD (Psychiatry)",
            "reg_no": reg_no,
            "facility": "GMCH Guwahati & Tele-Raktim Assam Hub",
            "active_roster": "Evening Tier-2 Escalation Shift (16:00 - 22:00 IST)",
            "specialization": "Clinical Psychiatry & Crisis De-escalation"
        }
    })

@app.route("/api/auth/analyzer", methods=["POST"])
def auth_analyzer():
    data = request.json or {}
    email = data.get("email", "sec-health@assam.gov.in")

    return jsonify({
        "success": True,
        "role": "analyzer",
        "profile": {
            "name": "Shri Biswajit Pegu, IAS",
            "role": "Commissioner & Secretary, Health & Family Welfare, Govt. of Assam",
            "clearance": "State Apex Clearance (Tier-4 Master Access)",
            "districts_monitored": 35,
            "connected_vault": "Assam State Data Centre (SDC) Live Stream"
        }
    })

# ==============================================================================
# API: CLINICAL NLP TRIAGE & CASE REGISTRATION
# ==============================================================================
@app.route("/api/triage/analyze", methods=["POST"])
def api_triage_analyze():
    data = request.json or {}
    raw_text = data.get("raw_text", "")
    district = data.get("district", "Kamrup Metropolitan")
    age_sex = data.get("age_sex", "24 / M")

    if not raw_text:
        return jsonify({"error": "No clinical text provided"}), 400

    nlp_result = analyze_transcript(raw_text)

    # Automatically generate Unique Case ID
    case_id = generate_case_id(district, nlp_result["icd_code"])

    # Save to Vault 2 (Clinical Cases Warehouse)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO clinical_cases_warehouse 
        (case_id, citizen_token, age_sex, district, chief_complaint, pii_masked_notes, triage_score, tier, icd_code, status, assigned_doctor_id, prescribed_action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        case_id,
        data.get("citizen_token", "TOKEN-TR-2026-AUTO"),
        age_sex,
        district,
        nlp_result["symptoms"][0] if nlp_result["symptoms"] else "General Distress",
        nlp_result["scrubbed_text"],
        nlp_result["triage_score"],
        nlp_result["tier"],
        nlp_result["icd_code"],
        "Pending Review",
        "DOC_GMCH_01",
        "Priority callback queued" if nlp_result["tier"] == "Red" else "Assigned to routine Tele-Raktim roster"
    ))
    conn.commit()
    conn.close()

    nlp_result["case_id"] = case_id
    return jsonify({
        "success": True,
        "data": nlp_result
    })

# ==============================================================================
# API: DOCTOR CASELOAD & STATUS UPDATES
# ==============================================================================
@app.route("/api/doctor/caseload", methods=["GET"])
def get_doctor_caseload():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM clinical_cases_warehouse ORDER BY created_at DESC;")
    cases = [dict(row) for row in cur.fetchall()]
    conn.close()

    pending_count = sum(1 for c in cases if c["status"] == "Pending Review")
    solved_count = sum(1 for c in cases if "Solved" in c["status"])

    return jsonify({
        "total_cases": len(cases),
        "pending_cases": pending_count,
        "solved_cases": solved_count,
        "cases": cases
    })

@app.route("/api/doctor/case/<case_id>/status", methods=["POST"])
def update_case_status(case_id):
    data = request.json or {}
    new_status = data.get("status", "Solved / Discharged")
    action_notes = data.get("prescribed_action", "Clinical intervention completed.")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE clinical_cases_warehouse 
        SET status = ?, prescribed_action = ?
        WHERE case_id = ?;
    """, (new_status, action_notes, case_id))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "case_id": case_id,
        "updated_status": new_status
    })

# ==============================================================================
# API: STATE ANALYZER (IAS) MACRO SURVEILLANCE
# ==============================================================================
@app.route("/api/analyzer/districts", methods=["GET"])
def get_analyzer_districts():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM district_surveillance_metrics ORDER BY distress_index DESC;")
    districts = [dict(row) for row in cur.fetchall()]
    conn.close()

    red_zones = sum(1 for d in districts if d["tier"] == "Red")
    amber_zones = sum(1 for d in districts if d["tier"] == "Amber")

    return jsonify({
        "total_districts": len(districts),
        "red_zones_count": red_zones,
        "amber_zones_count": amber_zones,
        "districts": districts
    })

@app.route("/api/analyzer/dispatch-order", methods=["POST"])
def create_dispatch_order():
    data = request.json or {}
    district = data.get("district", "Dhemaji")
    venue = data.get("venue", "Sissiborgaon Flood Relief Centre & CHC")
    mmu = data.get("mmu_unit", "MMU Unit #07")
    deploy_date = data.get("deployment_date", "2026-11-06")
    officer = data.get("authorizing_officer", "Shri Biswajit Pegu, IAS")

    memo_no = f"GOA/HFW/MMU-ORD/2026/{random.randint(1000, 9999)}"

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO camp_dispatch_orders (memo_number, district, venue, mmu_unit, deployment_date, authorizing_officer)
        VALUES (?, ?, ?, ?, ?, ?);
    """, (memo_no, district, venue, mmu, deploy_date, officer))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "memo_number": memo_no,
        "district": district,
        "venue": venue,
        "mmu_unit": mmu,
        "deployment_date": deploy_date,
        "status": "DIGITALLY_AUTHORIZED"
    })

# ==============================================================================
# API: CITIZEN SELF-CHECK ASSESSMENT (PHQ-9)
# ==============================================================================
@app.route("/api/citizen/assessment", methods=["POST"])
def citizen_assessment():
    data = request.json or {}
    scores = data.get("answers", [3, 3, 2, 3, 3]) # 5 questions (0-3)
    total_score = sum(scores)

    if total_score >= 11:
        tier = "Red"
        severity = "High Distress / Acute Overload"
        recommendation = "Emergency tele-counselling callback scheduled with GMCH team."
    elif total_score >= 6:
        tier = "Amber"
        severity = "Moderate Stress / Emotional Strain"
        recommendation = "Scheduled routine callback within 24 hours."
    else:
        tier = "Green"
        severity = "Mild Situational Tension"
        recommendation = "Mindfulness and sleep hygiene toolkits recommended."

    token = data.get("citizen_token", "TOKEN-TR-2026-7712")
    case_id = generate_case_id("Kamrup Metropolitan", "PHQ9")

    # Record into warehouse
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO clinical_cases_warehouse
        (case_id, citizen_token, age_sex, district, chief_complaint, pii_masked_notes, triage_score, tier, icd_code, status, prescribed_action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        case_id,
        token,
        "21 / M",
        "Kamrup Metropolitan",
        f"Self-Check Assessment ({severity})",
        f"Citizen self-administered PHQ-9. Total Score: {total_score}/15.",
        int(total_score * 6.6),
        tier,
        "F41.0 (Acute Anxiety / PHQ-9 Alert)",
        "Pending Review",
        recommendation
    ))
    conn.commit()
    conn.close()

    return jsonify({
        "total_score": total_score,
        "max_score": 15,
        "tier": tier,
        "severity": severity,
        "recommendation": recommendation,
        "case_id": case_id
    })

# ==============================================================================
# API: CONFIDENTIAL CITIZEN CHAT COPILOT
# ==============================================================================
@app.route("/api/citizen/chat", methods=["POST"])
def citizen_chat():
    data = request.json or {}
    msg = data.get("message", "").lower()

    if "exam" in msg or "panic" in msg or "stress" in msg or "পৰীক্ষা" in msg:
        reply = "Exam panic is completely understandable, but remember your worth is not defined by one test. Try box breathing: Inhale 4s, Hold 4s, Exhale 6s. Would you like me to connect you with our adolescent mentor on 14416?"
    elif "sleep" in msg or "insomnia" in msg or "শুব" in msg:
        reply = "Sleep loss heightens anxiety. Keep your mobile away 45 minutes before sleep and take slow, deep breaths. I can also schedule a free sleep wellness consultation for you."
    elif "alone" in msg or "hopeless" in msg or "help" in msg:
        reply = "You are not alone. Tele-Raktim is with you 24x7. If you feel overwhelmed, dial 14416 immediately—it is completely free and confidential."
    else:
        reply = "Namaskar. I am your Tele-Raktim Wellness Assistant. Your privacy is encrypted under the DPDP Act 2023. Tell me more about what you are going through today."

    return jsonify({
        "reply": reply,
        "timestamp": datetime.now().isoformat()
    })

# ==============================================================================
# API: GRASSROOTS ASHA TASKS & LOOP CLOSURE
# ==============================================================================
@app.route("/api/asha/tasks", methods=["GET"])
def get_asha_tasks():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM asha_referral_tasks ORDER BY created_at DESC;")
    tasks = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({"tasks": tasks})

@app.route("/api/asha/task/<task_id>/complete", methods=["POST"])
def complete_asha_task(task_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE asha_referral_tasks SET status = 'Completed' WHERE task_id = ?;", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "task_id": task_id, "status": "Completed"})

# ==============================================================================
# API: ACOUSTIC VOCAL BIOMARKER ANALYZER (X-FACTOR)
# ==============================================================================
@app.route("/api/acoustic/analyze-live", methods=["POST"])
def api_acoustic_analyze_live():
    """
    Accepts live microphone audio payload (base64 WAV or multipart file upload).
    Executes real DSP analysis: Pitch F0, Jitter %, Shimmer %, Vocal Tremor Hz,
    Speech Pause Ratio, and Harmonics-to-Noise Ratio (HNR).
    Logs evaluation session into acoustic_sessions table.
    """
    audio_bytes = None
    data = {}

    if request.is_json:
        data = request.json or {}
        b64_str = data.get("audio_base64") or data.get("audio") or ""
        if b64_str:
            if "," in b64_str:
                b64_str = b64_str.split(",", 1)[1]
            try:
                audio_bytes = base64.b64decode(b64_str)
            except Exception as e:
                return jsonify({"error": f"Invalid base64 audio payload: {str(e)}"}), 400
    elif "audio" in request.files:
        audio_file = request.files["audio"]
        audio_bytes = audio_file.read()

    if not audio_bytes:
        return jsonify({"error": "No audio stream provided. Provide audio_base64 or upload an audio file."}), 400

    analysis = analyze_audio_bytes(audio_bytes)

    session_id = f"AC-SESS-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
    case_id = data.get("case_id") or "CASE-LIVE-TRIAGE"
    token = data.get("citizen_token") or "TOKEN-LIVE-MIC"

    bm = analysis.get("biomarkers", {})

    # Save to database
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO acoustic_sessions (
                session_id, case_id, citizen_token, duration_seconds,
                mean_pitch_hz, jitter_pct, vocal_tremor_hz, shimmer_pct,
                hnr_db, pause_ratio, distress_score, tier,
                clinical_classification, recommendation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            session_id,
            case_id,
            token,
            analysis.get("duration_seconds", 0.0),
            bm.get("mean_pitch_hz", 130.0),
            bm.get("pitch_jitter_pct", 1.2),
            bm.get("vocal_tremor_hz", 5.0),
            bm.get("shimmer_pct", 2.5),
            bm.get("hnr_db", 16.0),
            bm.get("speech_pause_ratio", 0.20),
            analysis.get("acoustic_anxiety_score", 45),
            analysis.get("tier", "Green"),
            analysis.get("acoustic_status", "Baseline"),
            analysis.get("recommendation", "")
        ))
        conn.commit()
        conn.close()
    except Exception as db_err:
        print(f"Warning: Failed to log acoustic session to DB: {db_err}")

    analysis["session_id"] = session_id
    analysis["timestamp"] = datetime.now().isoformat()

    return jsonify({
        "success": True,
        "data": analysis
    })

@app.route("/api/acoustic/sessions", methods=["GET"])
def get_acoustic_sessions():
    """
    Returns recent acoustic biomarker evaluation sessions for clinical review.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM acoustic_sessions ORDER BY created_at DESC LIMIT 20;")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return jsonify({
        "total_sessions": len(rows),
        "sessions": rows
    })

@app.route("/api/acoustic/analyze", methods=["POST"])
def api_acoustic_analyze():
    data = request.json or {}
    res = analyze_acoustic_biomarkers(
        pitch_jitter_pct=data.get("pitch_jitter_pct"),
        vocal_tremor_hz=data.get("vocal_tremor_hz"),
        pause_ratio=data.get("speech_pause_ratio")
    )
    return jsonify({"success": True, "data": res})

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 8080))
    print(f"Tele-Raktim Full-Stack Server starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
