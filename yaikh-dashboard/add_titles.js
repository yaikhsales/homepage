const fs = require('fs');

const eng = {
  title_accountant: "Accountant",
  title_iews: "IEWS",
  title_purchase_request: "Purchase Request",
  title_bill_claim: "Bill Claim",
  title_salary_bill: "Salary Bill",
  title_shipping_bill: "Shipping Bill",
  title_yhr: "YHR",
  title_org_chart: "Org Chart",
  title_training: "Training",
  title_temp_worker: "Temporary Worker",
  title_speak_up: "Speak Up",
  title_support_ticket: "Support Ticket",
  title_y_shop: "Y Shop",
  title_gate_pass: "Gate Pass",
  title_meeting_room: "Meeting Room",
  title_car_booking: "Car Booking",
  title_fire_alarm: "Fire Alarm",
  title_cctv: "CCTV",
  title_digital_audit: "Digital Audit",
  title_energy: "Energy",
  title_air: "Air",
  title_water: "Water",
  title_waste: "Waste",
  title_chemical: "Chemical",
  title_shipping: "Shipping",
  title_e_government: "E-Government",
  title_management_dashboard: "Management Dashboard",
  title_sop: "SOP",
  title_system_analysis: "System Analysis",
  title_yqms: "YQMS",
  title_call_out: "Call Out",
  title_fc: "FC",
  title_ywip: "YWIP",
  title_ce: "CE",
  title_ytm: "YTM",
  title_ytm_shop: "YTM Shop",
  title_4dp: "4DP",
  title_ypi: "YPI",
  title_mrp: "MRP"
};

const kh = {
  title_accountant: "គណនេយ្យ",
  title_iews: "IEWS",
  title_purchase_request: "សំណើទិញ",
  title_bill_claim: "ការទាមទារវិក្កយបត្រ",
  title_salary_bill: "វិក្កយបត្រប្រាក់ខែ",
  title_shipping_bill: "វិក្កយបត្រដឹកជញ្ជូន",
  title_yhr: "YHR",
  title_org_chart: "រចនាសម្ព័ន្ធស្ថាប័ន",
  title_training: "ការបណ្តុះបណ្តាល",
  title_temp_worker: "បុគ្គលិកបណ្តោះអាសន្ន",
  title_speak_up: "និយាយឡើង",
  title_support_ticket: "សំបុត្រគាំទ្រ",
  title_y_shop: "Y Shop",
  title_gate_pass: "លិខិតឆ្លងកាត់ទ្វារ",
  title_meeting_room: "បន្ទប់ប្រជុំ",
  title_car_booking: "ការកក់រថយន្ត",
  title_fire_alarm: "ប្រកាសអាសន្នអគ្គីភ័យ",
  title_cctv: "CCTV",
  title_digital_audit: "សវនកម្មឌីជីថល",
  title_energy: "ថាមពល",
  title_air: "ខ្យល់",
  title_water: "ទឹក",
  title_waste: "កាកសំណល់",
  title_chemical: "គីមី",
  title_shipping: "ការដឹកជញ្ជូន",
  title_e_government: "រដ្ឋាភិបាលអេឡិចត្រូនិច",
  title_management_dashboard: "ផ្ទាំងគ្រប់គ្រង",
  title_sop: "SOP",
  title_system_analysis: "ការវិភាគប្រព័ន្ធ",
  title_yqms: "YQMS",
  title_call_out: "ហៅចេញ",
  title_fc: "FC",
  title_ywip: "YWIP",
  title_ce: "CE",
  title_ytm: "YTM",
  title_ytm_shop: "YTM Shop",
  title_4dp: "4DP",
  title_ypi: "YPI",
  title_mrp: "MRP"
};

const ch = {
  title_accountant: "会计",
  title_iews: "IEWS",
  title_purchase_request: "采购申请",
  title_bill_claim: "账单索赔",
  title_salary_bill: "工资单",
  title_shipping_bill: "货运账单",
  title_yhr: "YHR",
  title_org_chart: "组织结构图",
  title_training: "培训",
  title_temp_worker: "临时工",
  title_speak_up: "畅所欲言",
  title_support_ticket: "支持工单",
  title_y_shop: "Y Shop",
  title_gate_pass: "通行证",
  title_meeting_room: "会议室",
  title_car_booking: "车辆预订",
  title_fire_alarm: "火灾报警器",
  title_cctv: "闭路电视",
  title_digital_audit: "数字审计",
  title_energy: "能源",
  title_air: "空气",
  title_water: "水",
  title_waste: "废物",
  title_chemical: "化学品",
  title_shipping: "运输",
  title_e_government: "电子政务",
  title_management_dashboard: "管理仪表板",
  title_sop: "标准操作程序",
  title_system_analysis: "系统分析",
  title_yqms: "YQMS",
  title_call_out: "呼叫出站",
  title_fc: "FC",
  title_ywip: "YWIP",
  title_ce: "CE",
  title_ytm: "YTM",
  title_ytm_shop: "YTM Shop",
  title_4dp: "4DP",
  title_ypi: "YPI",
  title_mrp: "物料需求计划"
};

function insertKeys(filePath, newKeys) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newKeysStr = '';
  for (const key in newKeys) {
    const val = newKeys[key].replace(/"/g, '\\"');
    newKeysStr += `    ${key}: "${val}",\n`;
  }
  
  const regex = /(};?\s*export default translations;?)/;
  content = content.replace(regex, newKeysStr + '$1');
  
  // Make sure we have a comma before the new keys if not present
  content = content.replace(/([^,])(\s*)(title_accountant:)/g, '$1,\n$2$3');
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

insertKeys('src/translate/eng.js', eng);
insertKeys('src/translate/kh.js', kh);
insertKeys('src/translate/ch.js', ch);

console.log('Done mapping title translations!');
