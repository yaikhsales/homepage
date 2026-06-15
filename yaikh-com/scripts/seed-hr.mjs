/* Seed HR PA collections in the yaikhhomepage Atlas cluster.
 *
 *   Run from yaikh-com/:
 *     node scripts/seed-hr.mjs
 *
 * Idempotent: clears the 10 HR collections then re-inserts a realistic
 * Cambodian garment-factory baseline (~12 workers, 3 job postings, payroll
 * for June 2026, etc.) so the HR PA chat agent and dashboard have known
 * data to display.
 *
 * Reads MONGO_URL from .env.local.
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MONGO_URL missing — set it in yaikh-com/.env.local first");
  process.exit(1);
}

const now = () => new Date();

/* ─── Workforce Master (EMP-2026-NNNN) ─────────────────────────────────── */
const workforceMaster = [
  { no: "EMP-2026-0001", name_kh: "សុខ ច័ន្ទថា",      name_en: "Sok Chanthea",      sex: "F", dob: "2002-04-12", hire_date: "2024-03-01", line: "Line-1", section: "Sewing",   skill_grade: "operator",    status: "active",   nationality: "KH", nssf_no: "KH-NSSF-12876541", contract_type: "undefined" },
  { no: "EMP-2026-0002", name_kh: "ឡុង សុផល",        name_en: "Long Sophal",       sex: "M", dob: "1996-09-03", hire_date: "2021-07-15", line: "Line-1", section: "Sewing",   skill_grade: "line_leader", status: "active",   nationality: "KH", nssf_no: "KH-NSSF-10293874", contract_type: "undefined" },
  { no: "EMP-2026-0003", name_kh: "ហុង ស្រីពៅ",     name_en: "Hong Sreypov",      sex: "F", dob: "2001-12-21", hire_date: "2023-11-08", line: "Line-2", section: "Sewing",   skill_grade: "operator",    status: "active",   nationality: "KH", nssf_no: "KH-NSSF-12101023", contract_type: "fixed" },
  { no: "EMP-2026-0004", name_kh: "ឆាយ វណ្ណា",      name_en: "Chhay Vanna",       sex: "M", dob: "1985-06-30", hire_date: "2018-02-14", line: "Line-2", section: "Sewing",   skill_grade: "supervisor",  status: "active",   nationality: "KH", nssf_no: "KH-NSSF-09182736", contract_type: "undefined" },
  { no: "EMP-2026-0005", name_kh: "នួន ប៉ុណ្ណារ៉ុង", name_en: "Nuon Pannarong",    sex: "F", dob: "2003-01-17", hire_date: "2025-08-04", line: "Line-3", section: "Sewing",   skill_grade: "helper",      status: "active",   nationality: "KH", nssf_no: "KH-NSSF-13209847", contract_type: "fixed" },
  { no: "EMP-2026-0006", name_kh: "ដួង សុធា",       name_en: "Duong Sotha",       sex: "F", dob: "1999-08-25", hire_date: "2022-05-19", line: "Line-3", section: "Sewing",   skill_grade: "operator",    status: "active",   nationality: "KH", nssf_no: "KH-NSSF-11762345", contract_type: "undefined" },
  { no: "EMP-2026-0007", name_kh: "Liu Wei",            name_en: "Liu Wei",           sex: "M", dob: "1978-11-04", hire_date: "2019-09-23", line: null,     section: "Production",skill_grade: "manager",    status: "active",   nationality: "CN", nssf_no: null,                 contract_type: "fixed" },
  { no: "EMP-2026-0008", name_kh: "ប៉ែន សុខា",       name_en: "Pen Sokha",         sex: "F", dob: "2000-03-08", hire_date: "2024-12-02", line: null,     section: "Cutting",  skill_grade: "operator",    status: "active",   nationality: "KH", nssf_no: "KH-NSSF-12998877", contract_type: "fixed" },
  { no: "EMP-2026-0009", name_kh: "Kim Min-jun",        name_en: "Kim Min-jun",       sex: "M", dob: "1982-02-19", hire_date: "2020-04-11", line: null,     section: "QC",       skill_grade: "manager",     status: "active",   nationality: "KR", nssf_no: null,                 contract_type: "undefined" },
  { no: "EMP-2026-0010", name_kh: "ចេង ស្រីហ្គីច",   name_en: "Cheng Srey Geach",  sex: "F", dob: "1995-05-14", hire_date: "2020-10-05", line: null,     section: "HR",       skill_grade: "supervisor",  status: "active",   nationality: "KH", nssf_no: "KH-NSSF-10987654", contract_type: "undefined" },
  { no: "EMP-2026-0011", name_kh: "សុខ លីយ៉ា",       name_en: "Sok Liya",          sex: "F", dob: "2004-07-22", hire_date: "2026-05-15", line: "Line-1", section: "Sewing",   skill_grade: "helper",      status: "active",   nationality: "KH", nssf_no: "KH-NSSF-14223344", contract_type: "probation" },
  { no: "EMP-2026-0012", name_kh: "មាស រ៉ាប៊ីន",      name_en: "Meas Rabin",        sex: "F", dob: "1998-10-09", hire_date: "2022-01-20", line: "Line-2", section: "Packing",  skill_grade: "operator",    status: "resigned", nationality: "KH", nssf_no: "KH-NSSF-11556677", contract_type: "undefined" },
];

/* ─── Job Postings (JP-2026-NNN) ────────────────────────────────────────── */
const jobPostings = [
  { no: "JP-2026-001", title: "Sewing Operator — Line 1",  dept: "Production", line: "Line-1", headcount_target: 8,  channel: "FB",       status: "open",   posted_at: "2026-05-28", closing_at: "2026-06-30", jd_url: "https://facebook.com/TexLinkCareers/posts/jp-2026-001" },
  { no: "JP-2026-002", title: "Sewing Operator — Line 3",  dept: "Production", line: "Line-3", headcount_target: 5,  channel: "FB",       status: "filled", posted_at: "2026-04-15", closing_at: "2026-05-15", jd_url: "https://facebook.com/TexLinkCareers/posts/jp-2026-002" },
  { no: "JP-2026-003", title: "QC Inspector",              dept: "QC",         line: null,     headcount_target: 2,  channel: "website",  status: "open",   posted_at: "2026-06-01", closing_at: "2026-07-01", jd_url: "https://camhr.com/jobs/qc-inspector-tex-link" },
];

/* ─── Candidates (CAN-2026-NNN) ─────────────────────────────────────────────
 *
 * Extra fields beyond the API schema (dept, position, applicant_type, status_phase,
 * status_sub, submitted_at, photo_url) so the Recruitment dashboard list can render
 * directly from these docs.
 *
 * Names are tweaked from the recruitment UI labels (slightly different spellings).
 * Phone numbers are FAKE +855 numbers for test use only.
 * Photos are public pravatar.cc URLs — stable IDs so the same avatar shows each load.
 */
const candidates = [
  { no: "CAN-2026-001", name_kh: "ដូត ស្រីណុច",     name_en: "Dot Sreynoch",      sex: "F", dob: "2000-02-14", nid: "012345001", phone: "+855 010 223 445", address_province: "Phnom Penh",   source: "website",  job_posting_no: "JP-2026-003", referred_by: null,           stage: "screening",  dept: "Production", position: "QA Engineer",   applicant_type: "Staff",  status_phase: "PHASE 1: REVIEW", status_sub: "NEW APPLICANT",  submitted_at: "2026-02-13T09:30:00", photo_url: "https://i.pravatar.cc/150?img=47" },
  { no: "CAN-2026-002", name_kh: "កែម ផាននី",       name_en: "Koem Phanny",       sex: "F", dob: "1998-05-21", nid: "012345002", phone: "+855 012 334 556", address_province: "Kandal",       source: "FB",       job_posting_no: "JP-2026-003", referred_by: null,           stage: "screening",  dept: "Logistics",  position: "Coordinator",   applicant_type: "Staff",  status_phase: "PHASE 1: REVIEW", status_sub: "UNDER REVIEW",   submitted_at: "2026-02-13T10:15:00", photo_url: "https://i.pravatar.cc/150?img=44" },
  { no: "CAN-2026-003", name_kh: "ស៊ីន ឃុន",        name_en: "Sin Khun",          sex: "M", dob: "1996-08-09", nid: "012345003", phone: "+855 015 445 667", address_province: "Phnom Penh",   source: "referral", job_posting_no: "JP-2026-003", referred_by: "EMP-2026-0009", stage: "new",        dept: "Engineering",position: "Developer",     applicant_type: "Staff",  status_phase: "PHASE 1: REVIEW", status_sub: "NEW APPLICANT",  submitted_at: "2026-02-13T11:00:00", photo_url: "https://i.pravatar.cc/150?img=12" },
  { no: "CAN-2026-004", name_kh: "វុន សំណាង",      name_en: "Voun Samnang",      sex: "F", dob: "2001-04-30", nid: "012345004", phone: "+855 099 556 778", address_province: "Prey Veng",    source: "walkin",   job_posting_no: "JP-2026-001", referred_by: null,           stage: "new",        dept: "HR",         position: "Assistant",     applicant_type: "Worker", status_phase: "PHASE 1: REVIEW", status_sub: "NEW APPLICANT",  submitted_at: "2026-02-14T09:00:00", photo_url: "https://i.pravatar.cc/150?img=49" },
  { no: "CAN-2026-005", name_kh: "សេត សុភី",        name_en: "Set Sophy",         sex: "F", dob: "1999-11-12", nid: "012345005", phone: "+855 088 667 889", address_province: "Battambang",   source: "FB",       job_posting_no: "JP-2026-003", referred_by: null,           stage: "screening",  dept: "Operations", position: "Manager",       applicant_type: "Staff",  status_phase: "PHASE 1: REVIEW", status_sub: "UNDER REVIEW",   submitted_at: "2026-02-14T10:30:00", photo_url: "https://i.pravatar.cc/150?img=45" },
  { no: "CAN-2026-006", name_kh: "តន ស្រីនាង",     name_en: "Ton Sreyneang",     sex: "F", dob: "1994-07-18", nid: "012345006", phone: "+855 081 223 998", address_province: "Siem Reap",    source: "FB",       job_posting_no: "JP-2026-001", referred_by: null,           stage: "new",        dept: "Production", position: "Supervisor",    applicant_type: "Worker", status_phase: "PHASE 1: REVIEW", status_sub: "NEW APPLICANT",  submitted_at: "2026-02-15T13:45:00", photo_url: "https://i.pravatar.cc/150?img=48" },
  { no: "CAN-2026-007", name_kh: "ព្រឿង សុខឹម",     name_en: "Proeurng Sokhim",   sex: "F", dob: "2002-01-25", nid: "012345007", phone: "+855 092 556 887", address_province: "Phnom Penh",   source: "website",  job_posting_no: "JP-2026-003", referred_by: null,           stage: "new",        dept: "Marketing",  position: "Strategist",    applicant_type: "Staff",  status_phase: "PHASE 1: REVIEW", status_sub: "NEW APPLICANT",  submitted_at: "2026-02-15T15:15:00", photo_url: "https://i.pravatar.cc/150?img=43" },
  { no: "CAN-2026-008", name_kh: "ឡុង ផានិត",       name_en: "Long Phanit",       sex: "F", dob: "2003-09-04", nid: "012345008", phone: "+855 077 112 334", address_province: "Prey Veng",    source: "referral", job_posting_no: "JP-2026-001", referred_by: "EMP-2026-0002", stage: "offer",      dept: "Production", position: "Sewing Operator",applicant_type: "Worker",status_phase: "PHASE 2: INTERVIEW", status_sub: "OFFER SENT",  submitted_at: "2026-02-10T08:45:00", photo_url: "https://i.pravatar.cc/150?img=46" },
  { no: "CAN-2026-009", name_kh: "ហុង សុដារ៉ា",      name_en: "Hong Sodara",       sex: "F", dob: "2002-12-25", nid: "012345009", phone: "+855 016 778 990", address_province: "Takeo",        source: "walkin",   job_posting_no: "JP-2026-001", referred_by: null,           stage: "interview",  dept: "Production", position: "Sewing Operator",applicant_type: "Worker",status_phase: "PHASE 2: INTERVIEW", status_sub: "SCHEDULED",   submitted_at: "2026-02-11T14:20:00", photo_url: "https://i.pravatar.cc/150?img=41" },
  { no: "CAN-2026-010", name_kh: "ឆាយ ស្រីវិន",     name_en: "Chhay Sreyvin",     sex: "F", dob: "2005-02-14", nid: "012345010", phone: "+855 086 224 113", address_province: "Kampong Cham", source: "referral", job_posting_no: "JP-2026-001", referred_by: "EMP-2026-0010", stage: "rejected",   dept: "Production", position: "Sewing Operator",applicant_type: "Worker",status_phase: "PHASE 1: REVIEW", status_sub: "REJECTED",    submitted_at: "2026-02-09T10:30:00", photo_url: "https://i.pravatar.cc/150?img=42" },
  { no: "CAN-2026-011", name_kh: "សុខ លីយ៉ា",       name_en: "Sok Liya",          sex: "F", dob: "2004-07-22", nid: "012345011", phone: "+855 095 003 445", address_province: "Kandal",       source: "FB",       job_posting_no: "JP-2026-002", referred_by: null,           stage: "hired",      dept: "Production", position: "Sewing Operator",applicant_type: "Worker",status_phase: "PHASE 3: HIRED",     status_sub: "ONBOARDED",   submitted_at: "2026-04-20T11:00:00", photo_url: "https://i.pravatar.cc/150?img=20" },
];

/* ─── Interviews (INT-2026-NNN) ─────────────────────────────────────────── */
const interviews = [
  { no: "INT-2026-001", candidate_no: "CAN-2026-001", scheduled_at: "2026-06-12 09:00", line_leader: "Long Sophal (EMP-2026-0002)",  location: "Factory floor — Line 1", outcome: "pass",    score: 8, notes: "Strong on overlock. Available immediately." },
  { no: "INT-2026-002", candidate_no: "CAN-2026-002", scheduled_at: "2026-06-13 10:30", line_leader: "Long Sophal (EMP-2026-0002)",  location: "Factory floor — Line 1", outcome: "pass",    score: 9, notes: "Referred by Long Sophal, prior experience at Crystal Martin." },
  { no: "INT-2026-003", candidate_no: "CAN-2026-003", scheduled_at: "2026-06-15 14:00", line_leader: "Long Sophal (EMP-2026-0002)",  location: "Factory floor — Line 1", outcome: "pending", score: null, notes: null },
  { no: "INT-2026-004", candidate_no: "CAN-2026-004", scheduled_at: "2026-06-10 11:00", line_leader: "Kim Min-jun (EMP-2026-0009)",  location: "QC office",              outcome: "pending", score: null, notes: "Awaiting 2nd round with QC manager." },
  { no: "INT-2026-005", candidate_no: "CAN-2026-005", scheduled_at: "2026-06-11 09:30", line_leader: "Long Sophal (EMP-2026-0002)",  location: "Factory floor — Line 1", outcome: "fail",    score: 4, notes: "Did not pass speed test on single-needle." },
  { no: "INT-2026-006", candidate_no: "CAN-2026-006", scheduled_at: "2026-05-13 10:00", line_leader: "Chhay Vanna (EMP-2026-0004)",  location: "Factory floor — Line 3", outcome: "pass",    score: 7, notes: "Confirmed hire, started 2026-05-15." },
];

/* ─── Onboarding Records (ONB-2026-NNN) ─────────────────────────────────── */
const onboardingRecords = [
  { no: "ONB-2026-001", employee_no: "EMP-2026-0011", hire_date: "2026-05-15", line_assignment: "Line-1", factory_id: "TL-2026-0011", nid_copy: true, family_book: true,  nssf_registered: true,  orientation_done: true,  status: "complete" },
  { no: "ONB-2026-002", employee_no: "EMP-2026-0008", hire_date: "2024-12-02", line_assignment: "Cutting",factory_id: "TL-2024-0008", nid_copy: true, family_book: true,  nssf_registered: true,  orientation_done: true,  status: "complete" },
  { no: "ONB-2026-003", employee_no: "EMP-2026-0005", hire_date: "2025-08-04", line_assignment: "Line-3", factory_id: "TL-2025-0005", nid_copy: true, family_book: false, nssf_registered: true,  orientation_done: true,  status: "pending"  },
];

/* ─── Benefit Profiles (BP-2026-NNN) ────────────────────────────────────── */
const benefitProfiles = [
  { no: "BP-2026-001", employee_no: "EMP-2026-0001", base_salary_usd: 204, attendance_bonus_usd: 10, seniority_usd: 4,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-002", employee_no: "EMP-2026-0002", base_salary_usd: 320, attendance_bonus_usd: 10, seniority_usd: 10, transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-003", employee_no: "EMP-2026-0003", base_salary_usd: 204, attendance_bonus_usd: 10, seniority_usd: 4,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-004", employee_no: "EMP-2026-0004", base_salary_usd: 450, attendance_bonus_usd: 10, seniority_usd: 16, transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-005", employee_no: "EMP-2026-0005", base_salary_usd: 204, attendance_bonus_usd: 10, seniority_usd: 0,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-006", employee_no: "EMP-2026-0006", base_salary_usd: 204, attendance_bonus_usd: 10, seniority_usd: 8,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-007", employee_no: "EMP-2026-0007", base_salary_usd: 1800,attendance_bonus_usd: 0,  seniority_usd: 0,  transport_usd: 0, meal_usd: 0,  rice_allowance_usd: 0, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-008", employee_no: "EMP-2026-0008", base_salary_usd: 220, attendance_bonus_usd: 10, seniority_usd: 0,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-009", employee_no: "EMP-2026-0009", base_salary_usd: 2200,attendance_bonus_usd: 0,  seniority_usd: 0,  transport_usd: 0, meal_usd: 0,  rice_allowance_usd: 0, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-010", employee_no: "EMP-2026-0010", base_salary_usd: 550, attendance_bonus_usd: 10, seniority_usd: 12, transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-01-01", effective_to: null },
  { no: "BP-2026-011", employee_no: "EMP-2026-0011", base_salary_usd: 204, attendance_bonus_usd: 10, seniority_usd: 0,  transport_usd: 7, meal_usd: 0,  rice_allowance_usd: 5, effective_from: "2026-05-15", effective_to: null },
];

/* ─── Payroll Runs (PAY-YYYY-MM) ────────────────────────────────────────── */
const payrollRuns = [
  { no: "PAY-2026-04", period: "2026-04", run_date: "2026-04-25", worker_count: 312, gross_total_usd: 79420.00, deductions_total_usd: 2840.00, net_total_usd: 76580.00, nssf_total_usd: 3120.00, status: "paid",      paid_via: "ABA",  salary_bill_no: "SAL-2026-014" },
  { no: "PAY-2026-05", period: "2026-05", run_date: "2026-05-25", worker_count: 318, gross_total_usd: 81260.00, deductions_total_usd: 2910.00, net_total_usd: 78350.00, nssf_total_usd: 3210.00, status: "paid",      paid_via: "ABA",  salary_bill_no: "SAL-2026-018" },
  { no: "PAY-2026-06", period: "2026-06", run_date: "2026-06-25", worker_count: 322, gross_total_usd: 82540.00, deductions_total_usd: 2960.00, net_total_usd: 79580.00, nssf_total_usd: 3270.00, status: "finalized", paid_via: null,   salary_bill_no: null },
];

/* ─── Visas (VIS-2026-NNN) ──────────────────────────────────────────────── */
const visas = [
  { no: "VIS-2026-001", employee_no: "EMP-2026-0007", visa_type: "EB", issued_at: "2026-01-12", expires_at: "2027-01-11", fee_usd: 290, status: "active" },
  { no: "VIS-2026-002", employee_no: "EMP-2026-0009", visa_type: "EB", issued_at: "2025-09-30", expires_at: "2026-09-29", fee_usd: 290, status: "active" },
];

/* ─── Work Permits (WP-2026-NNN) ────────────────────────────────────────── */
const workPermits = [
  { no: "WP-2026-001", employee_no: "EMP-2026-0007", permit_no: "MLVT-WP-2026-44128", issued_at: "2026-01-20", expires_at: "2027-01-19", fee_usd: 100, mlvt_url: "https://www.mlvt.gov.kh/wp/MLVT-WP-2026-44128", status: "active" },
  { no: "WP-2026-002", employee_no: "EMP-2026-0009", permit_no: "MLVT-WP-2025-39811", issued_at: "2025-10-08", expires_at: "2026-10-07", fee_usd: 100, mlvt_url: "https://www.mlvt.gov.kh/wp/MLVT-WP-2025-39811", status: "active" },
];

/* ─── NSSF Contributions (NSSF-YYYY-MM) ─────────────────────────────────── */
const nssfContributions = [
  { no: "NSSF-2026-04", period: "2026-04", run_date: "2026-05-10", worker_count: 310, employer_share_usd: 1962.00, employee_share_usd: 1158.00, total_usd: 3120.00, status: "paid" },
  { no: "NSSF-2026-05", period: "2026-05", run_date: "2026-06-09", worker_count: 316, employer_share_usd: 2018.00, employee_share_usd: 1192.00, total_usd: 3210.00, status: "paid" },
  { no: "NSSF-2026-06", period: "2026-06", run_date: "2026-06-13", worker_count: 320, employer_share_usd: 2058.00, employee_share_usd: 1212.00, total_usd: 3270.00, status: "draft" },
];

const stamp = (doc) => ({ ...doc, createdAt: now(), updatedAt: now() });

const seedMap = {
  workforce_master:    workforceMaster,
  job_postings:        jobPostings,
  candidates:          candidates,
  interviews:          interviews,
  onboarding_records:  onboardingRecords,
  benefit_profiles:    benefitProfiles,
  payroll_runs:        payrollRuns,
  visas:               visas,
  work_permits:        workPermits,
  nssf_contributions:  nssfContributions,
};

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db("yaikh");
  for (const [name, docs] of Object.entries(seedMap)) {
    const col = db.collection(name);
    await col.deleteMany({});
    if (docs.length > 0) await col.insertMany(docs.map(stamp));
    console.log(`✓ ${name}: ${docs.length} docs`);
  }
  console.log("\nHR PA collections seeded.");
} catch (err) {
  console.error("Seed failed:", err);
  process.exitCode = 1;
} finally {
  await client.close();
}
