import React, { createContext, useContext, useMemo, useState } from "react";
import TranslationContext from "../translate/TranslationContext";
import { translateQualityText } from "../yqms/qualityTranslations";
import { FABRIC_INSPECTION_ROLES, roleKey } from "./sop-role-model";
export const SOP_LANGUAGES = [
 {code:"en",flag:"🇬🇧",label:"English"}, {code:"km",flag:"🇰🇭",label:"ខ្មែរ"},
 {code:"zh",flag:"🇨🇳",label:"中文"}, {code:"vi",flag:"🇻🇳",label:"Tiếng Việt"}, {code:"fil",flag:"🇵🇭",label:"Filipino"},
];
const LABELS = {
 km: {"Fabric inspection":"ការត្រួតពិនិត្យក្រណាត់","Person / role":"បុគ្គល / តួនាទី","What this person must do":"កិច្ចការដែលត្រូវអនុវត្ត","Evidence / hand-off":"ភស្តុតាង / ការប្រគល់","Department":"ផ្នែក","Morning":"ព្រឹក","Afternoon":"រសៀល","Lunch":"សម្រាកបាយ","OT":"ម៉ោងបន្ថែម","OFF":"ឈប់សម្រាក","Process chart":"ផែនទីដំណើរការ","Master list":"បញ្ជីមេ","Clear role highlight":"លុបការបន្លិចតួនាទី","All jobs":"កិច្ចការទាំងអស់","SOP · Standard Operating Procedures":"SOP · នីតិវិធីប្រតិបត្តិការស្តង់ដារ"},
 zh: {"Fabric inspection":"面料检验","Person / role":"人员 / 岗位","What this person must do":"岗位任务","Evidence / hand-off":"记录 / 交接","Department":"部门","Morning":"上午","Afternoon":"下午","Lunch":"午餐休息","OT":"加班","OFF":"休息","Process chart":"流程图","Master list":"总清单","Clear role highlight":"清除岗位高亮","All jobs":"全部任务","SOP · Standard Operating Procedures":"SOP · 标准作业程序"},
 vi: {"Fabric inspection":"Kiểm tra vải","Person / role":"Người / vai trò","What this person must do":"Nhiệm vụ phải thực hiện","Evidence / hand-off":"Bằng chứng / bàn giao","Department":"Bộ phận","Morning":"Buổi sáng","Afternoon":"Buổi chiều","Lunch":"Nghỉ trưa","OT":"Tăng ca","OFF":"Nghỉ","Process chart":"Sơ đồ quy trình","Master list":"Danh sách tổng","Clear role highlight":"Bỏ tô sáng vai trò","All jobs":"Tất cả nhiệm vụ","SOP · Standard Operating Procedures":"SOP · Quy trình thao tác chuẩn"},
 fil: {"Fabric inspection":"Inspeksiyon ng tela","Person / role":"Tao / tungkulin","What this person must do":"Mga gawaing dapat gawin","Evidence / hand-off":"Ebidensiya / pagpapasa","Department":"Departamento","Morning":"Umaga","Afternoon":"Hapon","Lunch":"Tanghalian","OT":"Overtime","OFF":"Walang pasok","Process chart":"Tsart ng proseso","Master list":"Pangunahing listahan","Clear role highlight":"Alisin ang highlight","All jobs":"Lahat ng gawain","SOP · Standard Operating Procedures":"SOP · Pamantayang pamamaraan ng trabaho"},
};
// Authored card translations preserve the underlying English role key for cross-card matching.
const ROWS = {
 zh: [
 ["仓库主管","找到正确的面料批次，核实卷数和身份。按规定比例安排待检布卷并运送至检验员。","批次位置、抽检卷清单及送检交接记录。"],
 ["面料检验主管","审核跟单质量要求及样品开发中的客户意见。开工前确认检验范围、评分方法、公差和升级处理要求。","向检验员传达当前检验要求、客户标准及样品意见。"],
 ["仓库质量控制员","审核产品开发和样品意见，明确色差、外观和既往缺陷等重点，核实批准的参照资料齐全。","向检验员移交质量关注清单；异常升级处理。"],
 ["面料检验员","取得批准的面料样、色卡及受控文件，核实布卷身份。清洁验布机，按作业指导书检查设备、照明、速度及测量设置。检验并记录缺陷、位置、分值、幅宽、长度和色差。","逐卷检验记录、实测结果、缺陷证据及异常。"],
 ["仓库工人 / 搬运支持","运送选定布卷，协助装卸并送回指定区域。经批准的搬运方案需要时由叉车司机操作。","保持布卷身份，分开存放已检、待检和暂停使用的面料。"],
 ["授权 QA 审核员","按客户标准审核报告，记录放行、暂停或拒收及原因；必要时安排追加检验或供应商跟进。","具名决定、日期、证据及明确的仓库处置指令。"],
 ["📷 AI 视觉物料检验","计划集成：从检验相机图像识别和定位面料缺陷，按供应商、合同/采购单、批次及布卷匹配 MRP 供应商检验提交；分析合同质量要求与申报及检验证据的差异，提交 QA 审核。","缺陷图像与位置、供应商报告及合同要求、NC 不符合原因，以及发给跟单员的供应商整改提醒。暂停及放行决定仍由授权 QA 作出。"],
 ],
 vi: [
 ["Giám sát kho","Xác định đúng lô vải, kiểm tra số lượng và mã cuộn. Chuẩn bị tỷ lệ cuộn cần kiểm theo yêu cầu và chuyển đến nhân viên kiểm vải.","Vị trí lô, danh sách cuộn được chọn và bàn giao cuộn để kiểm."],
 ["Giám sát kiểm tra vải","Xem yêu cầu chất lượng của bộ phận theo dõi đơn hàng và ý kiến người mua từ phát triển mẫu. Xác nhận phạm vi, cách chấm điểm, dung sai và hướng xử lý trước khi kiểm.","Hướng dẫn kiểm hiện hành, yêu cầu người mua và ý kiến mẫu chuyển cho nhân viên kiểm."],
 ["Nhân viên kiểm soát chất lượng kho","Xem ý kiến phát triển sản phẩm và mẫu; xác định điểm cần chú ý như màu sắc, ngoại quan và lỗi trước đây. Kiểm tra tài liệu tham chiếu đã được duyệt.","Danh mục lưu ý chất lượng giao cho nhân viên kiểm; báo cáo sai lệch."],
 ["Nhân viên kiểm vải","Nhận mẫu vải, bảng màu và tài liệu kiểm soát đã duyệt; kiểm tra mã cuộn. Vệ sinh máy, kiểm tra tình trạng, ánh sáng, tốc độ và thiết lập đo theo hướng dẫn. Kiểm và ghi lỗi, vị trí, điểm, khổ, chiều dài và màu.","Hồ sơ từng cuộn, số đo thực tế, bằng chứng lỗi và ngoại lệ."],
 ["Công nhân kho / hỗ trợ vận chuyển","Mang cuộn được chọn, hỗ trợ nạp/dỡ và trả về đúng khu vực. Dùng người lái xe nâng khi phương án vận chuyển được duyệt yêu cầu.","Giữ đúng mã cuộn; tách riêng vải đã kiểm, chờ kiểm và bị giữ."],
 ["Người duyệt QA được ủy quyền","Duyệt báo cáo theo tiêu chí người mua; ghi cho phép sử dụng, giữ hoặc từ chối cùng lý do. Yêu cầu kiểm bổ sung hoặc làm việc với nhà cung cấp khi cần.","Quyết định có tên, ngày, bằng chứng và chỉ dẫn xử lý kho rõ ràng."],
 ["📷 Kiểm tra vật liệu bằng AI Vision","Tích hợp dự kiến: phát hiện và định vị lỗi từ ảnh camera; đối chiếu báo cáo kiểm nhà cung cấp trong MRP theo nhà cung cấp, hợp đồng/PO, lô và cuộn. So sánh yêu cầu chất lượng hợp đồng với khai báo và bằng chứng để QA xem xét.","Ảnh/vị trí lỗi, báo cáo nhà cung cấp, điều khoản hợp đồng, lý do NC và cảnh báo cho nhân viên theo dõi đơn hàng để xử lý nhà cung cấp/CAP. QA được ủy quyền giữ quyền quyết định."],
 ],
 fil: [
 ["Superbisor ng bodega","Hanapin ang tamang lote ng tela; tiyakin ang bilang at pagkakakilanlan ng mga rolyo. Ihanda ang kinakailangang porsiyento ng mga rolyo at ihatid sa inspektor.","Lokasyon ng lote, listahan ng napiling rolyo at tala ng pagpapasa sa inspeksiyon."],
 ["Superbisor ng inspeksiyon ng tela","Suriin ang kalidad na hinihingi ng merchandising at komento ng mamimili mula sa pagbuo ng sample. Tiyakin ang saklaw, pagmamarka, tolerance at paraan ng pag-escalate bago magsimula.","Kasalukuyang gabay sa inspeksiyon, pamantayan ng mamimili at komento sa sample na naipasa sa inspektor."],
 ["Tagakontrol ng kalidad sa bodega","Suriin ang komento sa product development at sample. Tukuyin ang dapat bantayan gaya ng kulay, hitsura at dating mga depekto. Tiyaking naroon ang aprubadong mga sanggunian.","Checklist ng mga dapat bantayan na ipinasa sa inspektor; mga paglihis na ini-escalate."],
 ["Inspektor ng tela","Kunin ang aprubadong tela, color card at kontroladong dokumento; tiyakin ang ID ng rolyo. Linisin at suriin ang makina, ilaw, bilis at sukat ayon sa gabay. Itala ang mga depekto, lokasyon, puntos, lapad, haba at kulay.","Tala bawat rolyo, aktuwal na sukat, ebidensiya ng depekto at mga eksepsiyon."],
 ["Manggagawa sa bodega / paghawak","Dalhin ang napiling rolyo, tumulong sa pagkarga/pagbaba at ibalik sa tamang lugar. Gumamit ng forklift driver kung kailangan sa aprubadong plano.","Panatilihin ang ID ng rolyo at paghiwalayin ang nasuri, naghihintay at naka-hold."],
 ["Awtorisadong tagasuri ng QA","Suriin ang ulat ayon sa pamantayan ng mamimili. Itala ang release, hold o reject at dahilan; magpaulit ng inspeksiyon o mag-follow up sa supplier kung kailangan.","Desisyong may pangalan, petsa, ebidensiya at malinaw na tagubilin sa bodega."],
 ["📷 AI Vision na inspeksiyon ng materyal","Planong integrasyon: tuklasin at tukuyin ang depekto mula sa camera. Itugma sa supplier inspection sa MRP gamit ang supplier, kontrata/PO, lote at rolyo; ihambing ang kontratang kalidad sa deklarasyon at ebidensiya para sa QA.","Larawan/lokasyon ng depekto, ulat ng supplier, kondisyon ng kontrata, dahilan ng NC at alerto sa merchandiser para sa supplier/CAP. Awtorisadong QA pa rin ang nagpapasya sa hold/release."],
 ],
 km: [
 ["អ្នកត្រួតពិនិត្យឃ្លាំង","កំណត់ទីតាំងឡូតក្រណាត់ត្រឹមត្រូវ ផ្ទៀងផ្ទាត់ចំនួននិងអត្តសញ្ញាណរមូរ។ រៀបចំភាគរយរមូរដែលត្រូវត្រួតពិនិត្យ និងដឹកទៅអ្នកត្រួតពិនិត្យក្រណាត់។","ទីតាំងឡូត បញ្ជីរមូរដែលបានជ្រើស និងកំណត់ត្រាប្រគល់សម្រាប់ការត្រួតពិនិត្យ។"],
 ["ប្រធានត្រួតពិនិត្យក្រណាត់","ពិនិត្យតម្រូវការគុណភាពពីផ្នែកទំនាក់ទំនងបញ្ជាទិញ និងមតិអ្នកទិញពីការអភិវឌ្ឍគំរូ។ បញ្ជាក់វិសាលភាព វិធីដាក់ពិន្ទុ កម្រិតអនុញ្ញាត និងការរាយការណ៍មុនចាប់ផ្តើម។","សេចក្តីណែនាំបច្ចុប្បន្ន តម្រូវការអ្នកទិញ និងមតិលើគំរូដែលបានប្រគល់ឱ្យអ្នកត្រួតពិនិត្យ។"],
 ["អ្នកត្រួតពិនិត្យគុណភាពឃ្លាំង","ពិនិត្យមតិពីការអភិវឌ្ឍផលិតផលនិងគំរូ។ កំណត់ចំណុចត្រូវប្រយ័ត្ន ដូចជាពណ៌ រូបរាង និងកំហូចពីមុន ហើយផ្ទៀងផ្ទាត់ឯកសារយោងដែលបានអនុម័ត។","បញ្ជីចំណុចគុណភាពប្រគល់ឱ្យអ្នកត្រួតពិនិត្យ និងរាយការណ៍ភាពមិនស្រប។"],
 ["អ្នកត្រួតពិនិត្យក្រណាត់","ទទួលក្រណាត់គំរូ ប័ណ្ណពណ៌ និងឯកសារដែលបានអនុម័ត ហើយផ្ទៀងផ្ទាត់លេខរមូរ។ សម្អាតម៉ាស៊ីន ពិនិត្យស្ថានភាព ពន្លឺ ល្បឿន និងការកំណត់វាស់តាមការណែនាំ។ ត្រួតពិនិត្យនិងកត់ត្រាកំហូច ទីតាំង ពិន្ទុ ទទឹង ប្រវែង និងពណ៌។","កំណត់ត្រាតាមរមូរ លទ្ធផលវាស់ជាក់ស្តែង ភស្តុតាងកំហូច និងករណីលើកលែង។"],
 ["កម្មករឃ្លាំង / ជំនួយដឹកជញ្ជូន","នាំរមូរដែលបានជ្រើស ជួយដាក់និងដោះ ហើយប្រគល់ទៅតំបន់ត្រឹមត្រូវ។ ប្រើអ្នកបើករថយន្តលើកនៅពេលផែនការដឹកជញ្ជូនដែលបានអនុម័តតម្រូវ។","រក្សាអត្តសញ្ញាណរមូរ និងបែងចែកក្រណាត់ដែលបានពិនិត្យ កំពុងរង់ចាំ និងផ្អាកប្រើ។"],
 ["អ្នកពិនិត្យ QA ដែលមានសិទ្ធិ","ពិនិត្យរបាយការណ៍តាមលក្ខខណ្ឌអ្នកទិញ។ កត់ត្រាការអនុញ្ញាត ផ្អាក ឬបដិសេធ និងមូលហេតុ។ រៀបចំការពិនិត្យបន្ថែម ឬតាមដានអ្នកផ្គត់ផ្គង់បើចាំបាច់។","សេចក្តីសម្រេចមានឈ្មោះ កាលបរិច្ឆេទ ភស្តុតាង និងសេចក្តីណែនាំឃ្លាំងច្បាស់លាស់។"],
 ["📷 AI Vision ត្រួតពិនិត្យវត្ថុធាតុ","ការតភ្ជាប់គ្រោងទុក៖ រកនិងកំណត់ទីតាំងកំហូចពីរូបភាពកាមេរ៉ា។ ផ្គូផ្គងនឹងរបាយការណ៍អ្នកផ្គត់ផ្គង់ក្នុង MRP តាមអ្នកផ្គត់ផ្គង់ កិច្ចសន្យា/PO ឡូត និងរមូរ។ ប្រៀបធៀបតម្រូវការកិច្ចសន្យាជាមួយការប្រកាសនិងភស្តុតាងសម្រាប់ QA ពិនិត្យ។","រូបភាពនិងទីតាំងកំហូច របាយការណ៍អ្នកផ្គត់ផ្គង់ លក្ខខណ្ឌកិច្ចសន្យា មូលហេតុ NC និងជូនដំណឹងដល់អ្នកតាមដានបញ្ជាទិញសម្រាប់ការកែតម្រូវ។ QA ដែលមានសិទ្ធិរក្សាសិទ្ធិសម្រេចផ្អាក/អនុញ្ញាត។"],
 ],
};
const Context = createContext({language:"en",text:value=>value,localizeRole:role=>role});
export const useSopLanguage = () => useContext(Context);
export function SopLanguageProvider({children}) {
 const shared=useContext(TranslationContext);
 const [localLanguage,setLocalLanguage]=useState(()=>{try {const saved=localStorage.getItem("sop-language")||localStorage.getItem("app-language");return SOP_LANGUAGES.some(item=>item.code===saved)?saved:"en";}catch{return "en";}});
 const language=shared ? (shared.language === "tl" ? "fil" : SOP_LANGUAGES.some(item=>item.code===shared.language)?shared.language:"en") : localLanguage;
 const value=useMemo(()=>{
  const text=value=>LABELS[language]?.[value]||translateQualityText(language==="fil"?"tl":language,value);
  return {language,setLanguage:code=>{setLocalLanguage(code);shared?.changeLanguage(code==="fil"?"tl":code);try{localStorage.setItem("sop-language",code);}catch{}},text,localizeRole:role=>{const index=FABRIC_INSPECTION_ROLES.findIndex(item=>roleKey(item.role)===roleKey(role.role));const row=ROWS[language]?.[index];return row?{...role,role:row[0],does:row[1],evidence:row[2]}:{...role,role:text(role.role),does:text(role.does),evidence:text(role.evidence)};}};
 },[language,shared]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function SopLanguageFlags(){const {language,setLanguage}=useSopLanguage();return <div role="group" aria-label="SOP language" className="flex flex-wrap items-center gap-1">{SOP_LANGUAGES.map(item=><button key={item.code} title={item.label} aria-label={`SOP ${item.label}`} aria-pressed={language===item.code} onClick={()=>setLanguage(item.code)} className={`rounded px-2 py-1 text-base ${language===item.code?"bg-slate-600 ring-1 ring-emerald-400":"hover:bg-white/10"}`}><span aria-hidden="true">{item.flag}</span><span className="ml-1 text-sm">{item.label}</span></button>)}</div>;}
