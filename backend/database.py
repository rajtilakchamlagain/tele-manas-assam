"""
MANAS-Assam / Tele-Raktim Dual-Vault Database Engine
Implements DPDP Act 2023 Compliant Citizen Identity Vault (Vault 1)
and De-Identified Clinical Triage & Surveillance Warehouse (Vault 2).
"""

import sqlite3
import hashlib
import os
import random
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "tele_raktim.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Vault 1: Citizen Identity Vault (Strictly PII - Protected)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS citizens_identity_vault (
        citizen_id INTEGER PRIMARY KEY AUTOINCREMENT,
        citizen_token TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        phone_masked TEXT NOT NULL,
        phone_hash TEXT NOT NULL,
        email TEXT,
        district TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Vault 2: De-Identified Clinical Cases Warehouse
    cur.execute("""
    CREATE TABLE IF NOT EXISTS clinical_cases_warehouse (
        case_id TEXT PRIMARY KEY,
        citizen_token TEXT NOT NULL,
        age_sex TEXT NOT NULL,
        district TEXT NOT NULL,
        chief_complaint TEXT NOT NULL,
        pii_masked_notes TEXT,
        triage_score INTEGER NOT NULL,
        tier TEXT NOT NULL,
        icd_code TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Review',
        assigned_doctor_id TEXT DEFAULT 'DOC_GMCH_01',
        prescribed_action TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(citizen_token) REFERENCES citizens_identity_vault(citizen_token)
    );
    """)

    # District Surveillance & Spatial Metrics
    cur.execute("""
    CREATE TABLE IF NOT EXISTS district_surveillance_metrics (
        district_id TEXT PRIMARY KEY,
        name_en TEXT NOT NULL,
        name_as TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        distress_index INTEGER NOT NULL,
        tier TEXT NOT NULL,
        calls_30d INTEGER NOT NULL,
        top_complaint_en TEXT NOT NULL,
        top_complaint_as TEXT NOT NULL,
        mmu_assigned TEXT NOT NULL,
        next_camp_date TEXT NOT NULL,
        camp_venue_en TEXT NOT NULL,
        camp_venue_as TEXT NOT NULL,
        recommended_action TEXT NOT NULL
    );
    """)

    # Grassroots ASHA & CHO Loop Closure Tasks
    cur.execute("""
    CREATE TABLE IF NOT EXISTS asha_referral_tasks (
        task_id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        patient_token TEXT NOT NULL,
        reason TEXT NOT NULL,
        assigned_asha TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Visit',
        guidance TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Official Camp Dispatch Orders
    cur.execute("""
    CREATE TABLE IF NOT EXISTS camp_dispatch_orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        memo_number TEXT UNIQUE NOT NULL,
        district TEXT NOT NULL,
        venue TEXT NOT NULL,
        mmu_unit TEXT NOT NULL,
        deployment_date TEXT NOT NULL,
        authorizing_officer TEXT NOT NULL,
        status TEXT DEFAULT 'AUTHORIZED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def generate_case_id(district_name, icd_category="GEN"):
    """
    Format: CASE-[DIST]-[YEAR]-[CAT]-[HASH]
    Example: CASE-DHM-2026-F43A-4821
    """
    dist_code = district_name[:3].upper() if len(district_name) >= 3 else "ASM"
    year = "2026"
    cat_code = icd_category.replace(".", "")[:4].upper()
    random_hash = f"{random.randint(1000, 9999)}"
    return f"CASE-{dist_code}-{year}-{cat_code}-{random_hash}"

def mask_phone(phone_str):
    clean = "".join(filter(str.isdigit, str(phone_str)))
    if len(clean) >= 10:
        return f"+91 {clean[:5]} XXXXX"
    return "+91 XXXXX XXXXX"

def seed_initial_data(conn):
    cur = conn.cursor()
    # Check if already seeded
    cur.execute("SELECT COUNT(*) FROM district_surveillance_metrics;")
    if cur.fetchone()[0] > 0:
        return

    # Seed Districts
    districts = [
        ("kamrup_metro", "Kamrup Metropolitan", "কামৰূপ মহানগৰ", 26.1445, 91.7362, 86, "Red", 3820,
         "Adolescent & Career Anxiety (42%)", "কিশোৰ আৰু বৃত্তিজনিত মানসিক চাপ (৪২%)",
         "MMU Unit #01 (Dispur Hub)", "2026-11-08", "Sonapur Community Health Centre", "সোণাপুৰ সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
         "Roster 3 additional evening tele-counsellors; host youth stress coping seminar at Guwahati University."),
        ("sonitpur", "Sonitpur", "শোণিতপুৰ", 26.6528, 92.7926, 72, "Amber", 1940,
         "Substance De-Addiction & Depressive Disorders (36%)", "মাদকাসক্তি আৰু বিষাদজনিত সমস্যা (৩৬%)",
         "MMU Unit #04 (Tezpur Hub)", "2026-11-10", "Dhekiajuli Model Hospital", "ঢেকিয়াজুলি মডেল হাস্পতাল",
         "Dispatch 150 vials of injectable thiamine and oral anxiolytics; conduct tea-garden de-addiction drive."),
        ("dhemaji", "Dhemaji", "ধেমাজি", 27.4815, 94.5776, 91, "Red", 1480,
         "Post-Flood Acute Trauma & Severe Insomnia (+340% Spike)", "বানপানী উত্তৰ তীব্ৰ মানসিক আঘাত আৰু অনিদ্ৰা (+৩৪০% বৃদ্ধি)",
         "MMU Unit #07 (North Lakhimpur / Dhemaji)", "2026-11-06", "Sissiborgaon Flood Relief Centre & CHC", "চিচিবৰগাঁও বান সাহায্য কেন্দ্ৰ আৰু সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
         "Deploy Mobile Mental Health Van urgently for 3 days; conduct trauma counseling and psycho-social first aid."),
        ("dibrugarh", "Dibrugarh", "ডিব্ৰুগড়", 27.4728, 94.9120, 74, "Amber", 2110,
         "Tea-Garden Worker Stress & Alcohol Withdrawal (44%)", "চাহ জনগোষ্ঠীয় শ্ৰমিকৰ মানসিক চাপ আৰু সুৰাসক্তি (৪৪%)",
         "MMU Unit #03 (Upper Assam Hub)", "2026-11-12", "Moran Tea Estate Community Hall", "মৰাণ চাহ বাগিচা প্ৰেক্ষাগৃহ",
         "Empower local ASHA workers with vernacular audio toolkits on confidentiality; schedule weekend follow-up."),
        ("cachar", "Cachar", "কাছাৰ", 24.8333, 92.7789, 68, "Amber", 1650,
         "Somatic Distress & Post-Disaster Anxiety (31%)", "শাৰীৰিক উপসৰ্গ আৰু দুশ্চিন্তা (৩১%)",
         "MMU Unit #05 (Barak Valley Hub)", "2026-11-14", "Borkhola Community Health Centre", "বৰখোলা সমূহীয়া স্বাস্থ্য কেন্দ্ৰ",
         "Bilingual Bengali/Meitei mental health outreach van scheduled; replenish essential antidepressant stocks."),
        ("jorhat", "Jorhat", "যোৰহাট", 26.7509, 94.2037, 58, "Green", 1320,
         "Academic & Exam Stress (38%)", "শৈক্ষিক আৰু পৰীক্ষাৰ চাপ (৩৮%)",
         "MMU Unit #02 (Central Assam)", "2026-11-17", "Titabor Sub-Divisional Hospital", "তিতাবৰ মহকুমা চিকিৎসালয়",
         "Routine DMHP counselling camps; distribute student mental resilience toolkits to secondary schools."),
        ("nagaon", "Nagaon", "নগাঁও", 26.3468, 92.6840, 69, "Amber", 1890,
         "Depressive Disorders & Domestic Stress (35%)", "বিষাদ আৰু ঘৰুৱা মানসিক উদ্বেগ (৩৫%)",
         "MMU Unit #06 (Middle Assam)", "2026-11-11", "Kaliabor Sub-Divisional Hospital", "কলিয়াবৰ মহকুমা চিকিৎসালয়",
         "Intensify maternal health screening for postpartum depression at peripheral sub-centres."),
        ("barpeta", "Barpeta", "বৰপেটা", 26.3211, 91.0049, 82, "Red", 1540,
         "Displacement Trauma & Financial Despair (41%)", "নদীভাঙনি আৰু অৰ্থনৈতিক হতাশা (৪১%)",
         "MMU Unit #08 (Lower Assam Hub)", "2026-11-09", "Chenga Riverine Primary Health Centre", "চেঙা প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ",
         "Deploy mobile psychiatric boat-clinic to char/riverine areas; distribute sleep hygiene kits.")
    ]
    cur.executemany("""
    INSERT INTO district_surveillance_metrics VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    """, districts)

    # Seed Citizens (Vault 1)
    citizens = [
        ("TOKEN-TR-2026-7712", "Rahul Borah", "+91 98640 XXXXX", hashlib.sha256(b"9864012345").hexdigest(), "rahul.borah2005@gmail.com", "Kamrup Metropolitan"),
        ("TOKEN-TR-2026-4821", "Anamika Baruah", "+91 98642 XXXXX", hashlib.sha256(b"9864200000").hexdigest(), "anamika.b@gmail.com", "Dhemaji"),
        ("TOKEN-TR-2026-6022", "Rameswar Tanti", "+91 94355 XXXXX", hashlib.sha256(b"9435500000").hexdigest(), None, "Dibrugarh"),
        ("TOKEN-TR-2026-7143", "Dipika Saikia", "+91 94358 XXXXX", hashlib.sha256(b"9435800000").hexdigest(), None, "Nagaon"),
        ("TOKEN-TR-2026-5190", "Abhinav Sarma", "+91 94350 XXXXX", hashlib.sha256(b"9435000000").hexdigest(), "abhinav.s@seba.org", "Jorhat")
    ]
    cur.executemany("""
    INSERT INTO citizens_identity_vault (citizen_token, full_name, phone_masked, phone_hash, email, district)
    VALUES (?,?,?,?,?,?);
    """, citizens)

    # Seed Clinical Cases (Vault 2)
    cases = [
        ("CASE-KMR-2026-F41A-9041", "TOKEN-TR-2026-7712", "21 / M", "Kamrup Metropolitan", "Severe Academic Insomnia & Panic Triggers",
         "Patient reports acute test anxiety, inability to concentrate, parental expectations conflict.",
         88, "Red", "F41.0 (Panic Disorder)", "Pending Review", "DOC_GMCH_01", "Awaiting psychiatric video consult"),
        ("CASE-DHM-2026-F43A-4821", "TOKEN-TR-2026-4821", "44 / F", "Dhemaji", "Post-Flood Acute Trauma Reaction (PTSD)",
         "Displaced by river erosion. Sleep disruption for 15 days. Autonomic hyperarousal cues.",
         78, "Amber", "F43.10 (Acute PTSD)", "Pending Review", "DOC_GMCH_01", "Assigned to Sissiborgaon MMU Camp"),
        ("CASE-DBR-2026-F10A-6022", "TOKEN-TR-2026-6022", "38 / M", "Dibrugarh", "Alcohol Dependence with Withdrawal Delirium",
         "Admitted to AMCH Psychiatric Inpatient. Managed with Chlordiazepoxide taper.",
         96, "Red", "F10.4 (Withdrawal Delirium)", "Solved / Discharged", "DOC_GMCH_01", "Weekly ASHA Home Visit scheduled"),
        ("CASE-NAG-2026-F53A-7143", "TOKEN-TR-2026-7143", "26 / F", "Nagaon", "Postpartum Maternal Depression & Sleep Loss",
         "Reassured mother; started on safe SSRI regimen compatible with lactation.",
         84, "Amber", "F53.0 (Postpartum Disorder)", "Solved / Discharged", "DOC_GMCH_01", "Tele-Followup scheduled Nov 15"),
        ("CASE-JRT-2026-F41A-5190", "TOKEN-TR-2026-5190", "17 / M", "Jorhat", "Acute High School Exam Panic & Palpitations",
         "Passed passive suicidal ideation screening in triage. Immediate de-escalation conducted.",
         92, "Red", "F41.0 (Panic Disorder)", "Pending Review", "DOC_GMCH_01", "Mandatory specialist callback within 4 hours")
    ]
    cur.executemany("""
    INSERT INTO clinical_cases_warehouse VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);
    """, [(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], datetime.now()) for c in cases])

    # Seed ASHA Tasks
    asha_tasks = [
        ("TASK-DBR-084", "CASE-DBR-2026-F10A-6022", "Dibrugarh", "Moran Tea Estate (Line 4)", "PATIENT_6022",
         "Missed Scheduled De-Addiction Appointment (12 Days Overdue)", "Runjun Gogoi (ASHA #412)", "High", "Pending Visit",
         "Visit during evening shift. Ensure privacy; speak with spouse first. Reassure family regarding completely free medications under DMHP."),
        ("TASK-DHM-019", "CASE-DHM-2026-F43A-4821", "Dhemaji", "Sissiborgaon (Relief Cluster B)", "PATIENT_4821",
         "Flood Displaced - Post-Trauma Follow-up & Sleep Hygiene", "Anamika Doley (ASHA #108)", "Medium", "Completed",
         "Delivered oral electrolyte and vitamin supplements; accompanied patient to Sissiborgaon Mobile Health Camp."),
        ("TASK-NAG-103", "CASE-NAG-2026-F53A-7143", "Nagaon", "Kaliabor (Hatbor Sub-Centre)", "PATIENT_7143",
         "Postpartum Maternal Health Check & Mental Wellness Check", "Mina Saikia (CHO Hatbor)", "Medium", "In Progress",
         "Screen infant feeding progress; check maternal vital signs; confirm mother attended virtual counselling session.")
    ]
    cur.executemany("""
    INSERT INTO asha_referral_tasks VALUES (?,?,?,?,?,?,?,?,?,?,?);
    """, [(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], datetime.now()) for a in asha_tasks])

    conn.commit()
    print("Tele-Raktim Database Initialized & Seeded Successfully.")

if __name__ == "__main__":
    init_db()
