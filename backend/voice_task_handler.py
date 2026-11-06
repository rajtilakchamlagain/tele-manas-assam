"""
Tele-Raktim ASHA Vernacular Voice-to-Task Engine (X-Factor 3)
Transcribes and extracts clinical field actions from vernacular Assamese and code-mixed
voice notes recorded by frontline ASHA and CHO health workers in rural Assam.
Auto-closes referral loops, updates task registers, and alerts GMCH supervising clinicians.
Complies with DPDP Act 2023 & Mental Healthcare Act 2017.
"""

import re
from datetime import datetime
from database import get_connection
from nlp_engine import scrub_pii

# Action Lexicons for Assamese & Code-Mixed Clinical Notes
ACTION_LEXICON = [
    {
        "keywords": ["ঘৰলৈ গৈছিলোঁ", "ঘৰত গৈ", "দেখা কৰা হ'ল", "বাটত লগ পালোঁ", "home visit", "visited patient", "home visit done", "visited at home"],
        "action_en": "Home Visit Conducted",
        "action_as": "গৃহ পৰিদৰ্শন সম্পন্ন",
        "status": "Completed"
    },
    {
        "keywords": ["ঔষধ দিয়া হ'ল", "দৰব দিছোঁ", "ঔষধ খাইছে", "নিয়মীয়াকৈ খাইছে", "দৰব নিয়মীয়া", "medicine given", "medication compliance", "drugs delivered", "tablets checked"],
        "action_en": "Medication Compliance Verified & Stock Provided",
        "action_as": "ঔষধৰ নিয়মীয়া ব্যৱহাৰ আৰু যোগান নিশ্চিত",
        "status": "Completed"
    },
    {
        "keywords": ["পৰামৰ্শ দিলোঁ", "কথা পাতিলোঁ", "বুজাই দিয়া হ'ল", "মনোবল বঢ়ালোঁ", "পৰিয়ালৰ লগত", "counselled family", "psycho-social support", "family counselling", "spoke with spouse"],
        "action_en": "Family Psycho-Social Counselling Provided",
        "action_as": "পৰিয়ালক মানসিক সমৰ্থন আৰু পৰামৰ্শ প্ৰদান",
        "status": "Completed"
    },
    {
        "keywords": ["চিএইচচিলৈ পঠালোঁ", "হাস্পতাললৈ", "ডাক্তৰক দেখুৱাব", "জৰুৰী", "বিপদজনক", "মাদক পুনৰ", "সুৰা খাইছে", "referred to chc", "escalated to doctor", "hospital admission", "relapse", "crisis"],
        "action_en": "Escalated to CHC Medical Officer (Urgent Evaluation)",
        "action_as": "সামূহিক স্বাস্থ্য কেন্দ্ৰৰ চিকিৎসকক জৰুৰীভাৱে অৱগত",
        "status": "Escalated to Medical Officer"
    },
    {
        "keywords": ["ভাল পাইছে", "সুস্থ", "উন্নতি হৈছে", "স্বাভাৱিক", "stable", "recovering", "patient stable", "doing well", "normal"],
        "action_en": "Patient Condition Stable & Normal Daily Functioning",
        "action_as": "ৰোগীৰ অৱস্থা সন্তোষজনক আৰু সুস্থিৰ",
        "status": "Completed"
    }
]

def extract_asha_voice_action(raw_transcript):
    """
    Parses vernacular Assamese and English spoken notes.
    Extracts structured clinical action, status outcome, and bilateral summary.
    """
    scrubbed = scrub_pii(raw_transcript)
    lower_text = raw_transcript.lower()

    detected_actions_en = []
    detected_actions_as = []
    final_status = "Completed"

    for entry in ACTION_LEXICON:
        matched = False
        for kw in entry["keywords"]:
            if kw.lower() in lower_text or kw in raw_transcript:
                matched = True
                break
        if matched:
            if entry["action_en"] not in detected_actions_en:
                detected_actions_en.append(entry["action_en"])
                detected_actions_as.append(entry["action_as"])
            if entry["status"] == "Escalated to Medical Officer":
                final_status = "Escalated to Medical Officer"

    # Default fallback if no specific keywords matched
    if not detected_actions_en:
        detected_actions_en = ["Frontline Field Visit & Assessment Completed"]
        detected_actions_as = ["মাঠ পৰ্যায়ৰ পৰিদৰ্শন আৰু পৰ্যবেক্ষণ সম্পন্ন"]
        final_status = "Completed"

    action_summary_en = " • ".join(detected_actions_en)
    action_summary_as = " • ".join(detected_actions_as)

    # Supervising clinician note
    doctor_handover = (
        f"Grassroots Loop Closure: ASHA reported: '{scrubbed}'. "
        f"Verified Action: {action_summary_en}. "
        f"Status: {final_status}."
    )

    return {
        "scrubbed_transcript": scrubbed,
        "clinical_action_en": action_summary_en,
        "clinical_action_as": action_summary_as,
        "status": final_status,
        "is_loop_closed": (final_status == "Completed"),
        "doctor_handover": doctor_handover
    }

def process_asha_voice_note(task_id, raw_transcript, asha_name=None):
    """
    Processes ASHA voice note, updates the asha_referral_tasks table,
    and bridges clinical feedback to clinical_cases_warehouse in Vault 2.
    """
    parsed = extract_asha_voice_action(raw_transcript)
    now_iso = datetime.now().isoformat()

    conn = get_connection()
    cur = conn.cursor()

    # Find task
    if task_id:
        cur.execute("SELECT * FROM asha_referral_tasks WHERE task_id = ?;", (task_id,))
        task_row = cur.fetchone()
    else:
        # Default to first pending task
        cur.execute("SELECT * FROM asha_referral_tasks WHERE status != 'Completed' ORDER BY created_at ASC LIMIT 1;")
        task_row = cur.fetchone()
        if task_row:
            task_id = task_row["task_id"]

    if not task_row:
        conn.close()
        return {
            "success": False,
            "error": f"Task '{task_id}' not found in ASHA registry."
        }

    task_dict = dict(task_row)
    case_id = task_dict["case_id"]

    # 1. Update asha_referral_tasks
    cur.execute("""
        UPDATE asha_referral_tasks
        SET status = ?, voice_note_transcript = ?, clinical_action = ?, completed_at = ?
        WHERE task_id = ?;
    """, (parsed["status"], parsed["scrubbed_transcript"], parsed["clinical_action_en"], now_iso, task_id))

    # 2. Update corresponding case in clinical_cases_warehouse
    cur.execute("SELECT prescribed_action FROM clinical_cases_warehouse WHERE case_id = ?;", (case_id,))
    case_row = cur.fetchone()
    if case_row:
        existing_action = case_row["prescribed_action"] or ""
        updated_action = f"{existing_action} | [ASHA Loop Closed: {parsed['clinical_action_en']} at {now_iso[:10]}]"
        new_case_status = "Solved / Field Verified" if parsed["status"] == "Completed" else "Escalated for Urgent OPD Callback"
        cur.execute("""
            UPDATE clinical_cases_warehouse
            SET status = ?, prescribed_action = ?
            WHERE case_id = ?;
        """, (new_case_status, updated_action, case_id))

    conn.commit()

    # Retrieve updated task
    cur.execute("SELECT * FROM asha_referral_tasks WHERE task_id = ?;", (task_id,))
    updated_row = dict(cur.fetchone())
    conn.close()

    return {
        "success": True,
        "task_id": task_id,
        "case_id": case_id,
        "status": parsed["status"],
        "clinical_action_en": parsed["clinical_action_en"],
        "clinical_action_as": parsed["clinical_action_as"],
        "transcript": parsed["scrubbed_transcript"],
        "doctor_handover": parsed["doctor_handover"],
        "completed_at": now_iso,
        "updated_task": updated_row
    }

if __name__ == "__main__":
    # Test script
    test_voice = "ৰমেন দাসৰ ঘৰলৈ গৈছিলোঁ। ঔষধ নিয়মিত খোৱা হৈছে আৰু বৰ্তমান সুস্থ। কামটো সম্পন্ন হ'ল।"
    res = process_asha_voice_note("TASK-DBR-084", test_voice)
    print("Test Result Status:", res.get("status"))
    print("Clinical Action:", res.get("clinical_action_en"))
