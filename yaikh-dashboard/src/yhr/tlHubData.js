// Visible TL YHR navigation, reviewed 22 October 2026. Links retain TL's authenticated workflows.
const service = (title, image, path, description) => ({ title, image, path, description });
export const SERVICES = [
  service('My Team','my_team_icon.png',null,'Manage Team Actions'),
  service('Daily Presence','face.png','/dashboard/yhr/user_attendance','Check your Ai Cam face detection record daily report, late minutes, and OT totals.'),
  service('Apply Leave','leave_icon.png','/dashboard/yhr/leave','Request leave and track your requests.'),
  service('Leave Behavior (AL)','leave_behavior_icon.svg','/dashboard/yhr/leave/al-history','View your own annual leave usage and balance by contract.'),
  service('OT Request','ot_request_icon.png','/dashboard/yhr/ot','Request overtime and track your approvals.'),
  service('Working Calendar','holidays_11880339.png','/dashboard/yhr/working_calendar','View your assigned work schedule, shifts, and holiday calendar.'),
  service('Smart PaySlip','kottra_payslip.png',null,'View your live-calculated monthly salary breakdown derived from camera logs.'),
  service('Request Resign','resignation_request_icon.png','/dashboard/yhr/resignation','Submit a resignation request, propose your exit date, and track status.'),
  service('Temporary Worker Request','special_main.jpg','/dashboard/Worker','Request and manage temporary worker placements.'),
];
export const ADMIN_GROUPS = [
  {id:'people',title:'People Management',protected:true},
  {id:'attendance',title:'Time & Attendance'},
  {id:'payroll',title:'Payroll & Finance',protected:true},
  {id:'reports',title:'Report Hub'},
  {id:'tools',title:'Tools & Setup'},
];
export const ADMIN_CARDS = {
  attendance:[
    service('Attendance Hub','attendance.png','/admin/yhr/attendance','Manage monthly checklists, daily scan status, and raw face scan logs.'),
    service('Attendance Review Center','attendance_review_center_icon.png','/admin/yhr/missed-hours','Review missed scans and check employee attendance approval before payroll.'),
    service('OT Management','ot_management_icon.png','/admin/yhr/ot','Review and approve employee overtime requests.'),
    service('Leave Management','leave_management_admin.png','/admin/yhr/leave','Process employee leave requests.'),
    service('Manage AL Balance','leave_icon.png','/admin/yhr/leave-balance','Manage and adjust employee annual leave balances, add bonuses, or deduct days.'),
    service('Working schedule','working_schedule_icon.png','/admin/yhr/working-schedules','Manage employee working schedules by defining custom start and end dates.'),
  ],
  reports:[service('Report','system-analytic.avif','/admin/yhr/payroll/employee-report','View and export various reports')],
  tools:[
    service('Public Holiday','holidays_11880339.png','/admin/yhr/holiday','Set and manage company holidays.'),
    service('Activity Hub','event_management.png','/admin/yhr/events','Manage company events and news.'),
    service('Job Post','job_poster_icon.png','/admin/yhr/job-poster','Manage and publish job vacancies.'),
    service('YHR Settings','salary bill icon.png','/admin/yhr/settings','Configure attendance rules, payroll thresholds, and company-wide YHR policies.'),
    service('Approval Settings','approval_images-removebg-preview.png','/admin/yhr/approval-settings','Define custom Leave and Overtime approval setting rules.'),
    service('Structure Management','employee_center_admin.png','/admin/yhr/structure','Manage departments, sections, and positions'),
  ],
};
export const TEAM_CARDS = {
  review:[
    service('Team Leave Approvals','leave_management_admin.png','/admin/yhr/leave?view=team','Review and approve leave requests for your team.'),
    service('Team OT Approvals','ot_management_icon.png','/admin/yhr/ot?view=team','Review and approve overtime requests for your team.'),
    service('Team Contract Renewals','employee_center_admin.png','/dashboard/yhr/team-renewals','Review and decide on contract renewals for your subordinates.'),
    service('Team Resign Approvals','resignation_request_icon.png','/admin/yhr/resignation-requests','Review and approve resignation requests for your team.'),
  ],
  operations:[
    service('Team Attendance','attendance.png','/dashboard/yhr/view_attendance','See who is in, late, or on leave.'),
    service('Apply Team Leave','leave_icon.png','/dashboard/yhr/leave?tab=team_leave','Submit leave requests on behalf of your team members.'),
    service('Submit Team OT','ot_request_icon.png','/dashboard/yhr/ot?tab=team','Submit overtime for your team members or whole shift.'),
  ],
};
