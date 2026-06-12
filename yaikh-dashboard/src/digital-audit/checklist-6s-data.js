export const DEPARTMENTS = [
    "Cutting", "Sewing", "Finishing", "Packing", "Warehouse",
    "QA / QC", "Maintenance", "Office", "Canteen", "Security", "Factory",
];

export const S_CRITERIA = [
    {
        s: "S1", key: "s1", label: "Sort", fullLabel: "Sort (Seiri)", color: "red",
        description: "Remove all unnecessary items from the workplace",
        items: [
            "Unnecessary items removed from workstation",
            "Only required tools present",
            "Expired or obsolete materials disposed",
            "Red tag area designated and active",
        ],
    },
    {
        s: "S2", key: "s2", label: "Set in Order", fullLabel: "Set in Order (Seiton)", color: "orange",
        description: "Organize everything in its proper place",
        items: [
            "Items labeled and stored in designated locations",
            "Walkways and aisles clearly marked",
            "Shadow boards / visual management used",
            "Storage areas easy to access within 30 seconds",
        ],
    },
    {
        s: "S3", key: "s3", label: "Shine", fullLabel: "Shine (Seiso)", color: "yellow",
        description: "Clean and inspect the workplace regularly",
        items: [
            "Workstation cleaned at end of shift",
            "Equipment free of oil / dust / debris",
            "Cleaning schedule posted and followed",
            "Inspection during cleaning completed",
        ],
    },
    {
        s: "S4", key: "s4", label: "Standardize", fullLabel: "Standardize (Seiketsu)", color: "green",
        description: "Create standards for the first 3 S's",
        items: [
            "Standards and procedures documented",
            "Checklists available at workstations",
            "Visual cues used for consistency",
            "Best practices shared across areas",
        ],
    },
    {
        s: "S5", key: "s5", label: "Sustain", fullLabel: "Sustain (Shitsuke)", color: "blue",
        description: "Maintain and review standards continuously",
        items: [
            "Previous audit actions completed",
            "Employees trained on 5S / 6S",
            "Audit results displayed visually",
            "Continuous improvement culture evident",
        ],
    },
    {
        s: "S6", key: "s6", label: "Safety", fullLabel: "Safety (Anzen)", color: "purple",
        description: "Safety integrated into every standard",
        items: [
            "Emergency exits clear and clearly marked",
            "PPE available and used correctly",
            "No tripping / slipping hazards present",
            "Safety signs present and legible",
        ],
    },
];

export const SCORE_LABELS = [
    { val: 0, text: "0 – Not done" },
    { val: 1, text: "1 – Poor" },
    { val: 2, text: "2 – Fair" },
    { val: 3, text: "3 – Good" },
    { val: 4, text: "4 – Very Good" },
    { val: 5, text: "5 – Excellent" },
];

export const C = {
    red: { ring: "border-red-300 bg-red-50", badge: "bg-red-500", text: "text-red-600", light: "bg-red-100 text-red-700" },
    orange: { ring: "border-orange-300 bg-orange-50", badge: "bg-orange-500", text: "text-orange-600", light: "bg-orange-100 text-orange-700" },
    yellow: { ring: "border-yellow-300 bg-yellow-50", badge: "bg-yellow-400", text: "text-yellow-600", light: "bg-yellow-100 text-yellow-700" },
    green: { ring: "border-green-300 bg-green-50", badge: "bg-green-500", text: "text-green-600", light: "bg-green-100 text-green-700" },
    blue: { ring: "border-blue-300 bg-blue-50", badge: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100 text-blue-700" },
    purple: { ring: "border-purple-300 bg-purple-50", badge: "bg-purple-500", text: "text-purple-600", light: "bg-purple-100 text-purple-700" },
};

export const DEPT_CHECKLISTS = [
    {
        department: "Sewing",
        area: "Sewing Area (ដេរសោ)",
        category: "Production",
        checklist: "6S Standard – Walk way",
        items: [
            { id: 1, note_en: "Floor clean and dry", note_kh: "ផ្ទៃឥដ្ឋស្អាត និង ស្ងួត", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Walkways free from tools, trash, or obstructions", note_kh: "ផ្លូវដើរគ្មានឧបករណ៍ ឬ របស់ រារាំង", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Yellow lines clearly visible and not faded", note_kh: "ខ្សែបន្ទាត់លឿងច្បាស់ និង មិនបែក", refImg: "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=500&h=350&fit=crop" },
            { id: 4, note_en: "No personal items or bags placed on walkways", note_kh: "មិនមានទ្រព្យផ្ទាល់ខ្លួននៅលើផ្លូវដើរ", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&h=350&fit=crop" },
            { id: 5, note_en: "Emergency exit routes clearly marked and unobstructed", note_kh: "ផ្លូវចេញពេលអាសន្នច្បាស់លាស់ មិនមានរបស់ blocked", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=350&fit=crop" },
        ],
    },
    {
        department: "Cutting",
        area: "Cutting Area (កាត់ដ)",
        category: "Production",
        checklist: "6S Standard – Tool & Equipment",
        items: [
            { id: 1, note_en: "All cutting tools stored in designated holders when not in use.", note_kh: "ឧបករណ៍កាត់ទាំងអស់ត្រូវដាក់ក្នុងកន្លែងកំណត់", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=130&fit=crop" },
            { id: 2, note_en: "No fabric scraps accumulating under tables.", note_kh: "មិនមានបំណែកក្រណាត់ accumulated នៅក្រោមមេហ្ស", refImg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Machine guards in place and functional.", note_kh: "ឧបករណ៍ការពារម៉ាស៊ីននៅអំពើ ហើយប្រើបាន", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Cutting table surface clean and free of debris.", note_kh: "ផ្ទៃតុកាត់ស្អាត គ្មានវត្ថុ ឬកាកសំណល់", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Sample Room",
        area: "Sample Room (មន្ទីរគំរូ)",
        category: "Support",
        checklist: "6S Standard – Sample Area",
        items: [
            { id: 1, note_en: "Sample garments hung neatly on racks with labels.", note_kh: "ស្លៀកពាក់គំរូព្យួរត្រឹមត្រូវនៅលើ rack និងដាក់ស្លាក", refImg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Sewing machines cleaned and oiled after each use.", note_kh: "ម៉ាស៊ីនដេរ cleaned និង oiled ក្រោយប្រើ", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Fabric swatches filed and indexed properly.", note_kh: "គំរូក្រណាត់ filed ហើយ indexed ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "SCC",
        area: "SCC",
        category: "Production",
        checklist: "6S Standard – SCC Area",
        items: [
            { id: 1, note_en: "Work stations organized with clear labeling.", note_kh: "តំបន់ការងារ organized ហើយ labeled ច្បាស់លាស់", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
            { id: 2, note_en: "No unnecessary items on desks or tables.", note_kh: "មិនមានវត្ថុ unnecessary នៅលើតុ", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Documents filed and not scattered on the floor.", note_kh: "ឯកសារ filed ហើយមិនគ្មានបោះចោលនៅលើឥដ្ឋ", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Ironing",
        area: "Ironing Department (រំកិលក)",
        category: "Production",
        checklist: "6S Standard – Ironing",
        items: [
            { id: 1, note_en: "Ironing boards padded and covered correctly.", note_kh: "ចំណុចដំឡើងដ្បិត ថ្នមហើយ ដណ្ដប់ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Steam irons stored upright and cooled before storage.", note_kh: "ដ្បិតចំហាយ stored ឈរ និង cool ក្រោយប្រើ", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
            { id: 3, note_en: "No water spillage around ironing stations.", note_kh: "មិនមានទឹកប្រោះនៅជុំវិញ ironing station", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Electrical cords not tangled or placed on walkways.", note_kh: "ខ្សែភ្លើងមិន tangled ឬដាក់នៅលើផ្លូវដើរ", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Finishing Good Room",
        area: "Finishing Good Room (បន្ទប់...)",
        category: "Production",
        checklist: "6S Standard – Finishing",
        items: [
            { id: 1, note_en: "Finished goods labeled and sorted by size/style.", note_kh: "ទំនិញស្រេចដាក់ស្លាក និង sort តាមទំហំ/រចនាប័ទ្ម", refImg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Inspection tables clean and free of dust.", note_kh: "តុត្រួតពិនិត្យស្អាត គ្មានធូលី", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Packaging materials restocked and stored properly.", note_kh: "វត្ថុខ្ចប់ restock ហើយ stored ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "OPA Area",
        area: "OPA Area (កន្លែងរំដ...)",
        category: "Production",
        checklist: "6S Advanced – OPA",
        items: [
            { id: 1, note_en: "OPA machines wiped and cleaned at shift end.", note_kh: "ម៉ាស៊ីន OPA លាង cleaned ក្រោយ shift end", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Chemical containers properly sealed and labeled.", note_kh: "ធុង chemical sealed ហើយ labeled ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 3, note_en: "PPE available and used correctly by all operators.", note_kh: "PPE មាន ហើយ operators ប្រើប្រាស់ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Spill containment trays in place and clean.", note_kh: "Catch tray in place ហើយ clean", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Stain Cleaning",
        area: "Stain Cleaning Room (បន្ទប់ជំរះប្រឡាក់)",
        category: "Support",
        checklist: "6S Advanced – Stain Cleaning",
        items: [
            { id: 1, note_en: "Stain removal chemicals stored in ventilated cabinet.", note_kh: "គីមី stain stored ក្នុង ventilated cabinet", refImg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Drains unblocked and cleaned after each shift.", note_kh: "ទ្រង់ទឹក unblocked ហើយ cleaned ក្រោយ shift", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Dirty garment bins emptied and sanitized daily.", note_kh: "ធុងខោអាវ dirty emptied ហើយ sanitized ប្រចាំថ្ងៃ", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Scan and Pack",
        area: "Scan and Pack Area (កន្លែងស្ងើននិងខ្ចប់)",
        category: "Production",
        checklist: "6S Advanced – Scan & Pack",
        items: [
            { id: 1, note_en: "Barcode scanners charged and stored in holders.", note_kh: "Barcode scanner charge ហើយ stored ក្នុងកន្លែងដាក់", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Packing table surface cleared after each order.", note_kh: "ផ្ទៃតុខ្ចប់ cleared ក្រោយ order", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Completed boxes moved to shipping area immediately.", note_kh: "ប្រអប់ ready-to-ship moved ភ្លាមទៅ shipping area", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Printer supplies (labels, ink) restocked before shift end.", note_kh: "ក្រដាស/ink restock មុន shift end", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Packing",
        area: "Packing Area (កន្លែងខ្ចប់)",
        category: "Production",
        checklist: "6S Standard – Packing",
        items: [
            { id: 1, note_en: "Packing materials stored neatly in designated areas.", note_kh: "សម្ភារៈខ្ចប់ stored ស្អាត នៅ designated area", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Carton boxes stacked safely, not exceeding height limit.", note_kh: "ប្រអប់ carton ដាក់ ត្រឹមត្រូវ មិនលើស height limit", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Weighing scales calibrated and checked daily.", note_kh: "ម៉ាស៊ីន​ជា់ calibrate ហើយ check ប្រចាំថ្ងៃ", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Tape dispensers maintained and not left on the floor.", note_kh: "Tape dispenser maintain ហើយ មិនដាក់ពីក្រោម", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Storage Machines",
        area: "Storage Machines (ឃ្លាំងម៉ាស)",
        category: "Utility",
        checklist: "6S Standard – Storage",
        items: [
            { id: 1, note_en: "Machines stored with protective covers when idle.", note_kh: "ម៉ាស៊ីន stored ជាមួយ protective cover ពេល idle", refImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Storage aisles clear of obstacles for forklift access.", note_kh: "ផ្លូវ forklift clear ពីរបស់រ ារ", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Inventory labeling up-to-date and legible.", note_kh: "ស្លាក Inventory up-to-date ហើយ អានបាន", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Waste Incinerator",
        area: "Waste Incinerator Machine (ម៉ាស...)",
        category: "Utility",
        checklist: "6S Safety – Waste Disposal",
        items: [
            { id: 1, note_en: "Incinerator exterior cleaned of ash and residue daily.", note_kh: "Ash ហើយ residue នៅ incinerator ត្រូវ cleaned ប្រចាំថ្ងៃ", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Safety signs posted and legible near waste area.", note_kh: "សញ្ញា safety posted ហើយ legible ជិត waste area", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Fire extinguisher present and within expiry date.", note_kh: "ម៉ាស៊ីនពន្លត់ភ្លើង present ហើយ ក្នុង expiry date", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Waste sorted: fabric, plastic, chemical waste separated.", note_kh: "កាកសំណល់ sort: ក្រណាត់, plastic, គីមី separated", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Washing Room",
        area: "Washing Room (បន្ទប់លាងក)",
        category: "Support",
        checklist: "6S Standard – Washing",
        items: [
            { id: 1, note_en: "Washing machines cleaned inside drum after each cycle.", note_kh: "Drum ម៉ាស៊ីនលាង cleaned ក្រោយ cycle", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Detergent containers sealed and stored on shelves.", note_kh: "ធុង detergent sealed ហើយ stored នៅលើ shelf", refImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Floor dry and no standing water near machines.", note_kh: "ឥដ្ឋ ស្ងួត ហើយ គ្មានទឹក standing ជិតម៉ាស៊ីន", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Drain covers in place and unblocked.", note_kh: "គម្របបំពង់ in place ហើយ unblocked", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Chemicals Room",
        area: "Chemicals Room (បន្ទប់គីមី)",
        category: "Support",
        checklist: "6S Safety – Chemicals",
        items: [
            { id: 1, note_en: "All chemical containers labeled with SDS available nearby.", note_kh: "ធុងគីមី labeled ហើយ SDS available ជិតៗ", refImg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=130&fit=crop" },
            { id: 2, note_en: "Incompatible chemicals stored separately.", note_kh: "គីមី incompatible stored separately", refImg: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=130&fit=crop" },
            { id: 3, note_en: "Eye wash station functional and easily accessible.", note_kh: "Eye wash station functional ហើយ accessible", refImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=130&fit=crop" },
            { id: 4, note_en: "Spill kit stocked and visible near chemical storage.", note_kh: "Spill kit stocked ហើយ visible ជិត chemical storage", refImg: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=130&fit=crop" },
        ],
    },
    {
        department: "Factory",
        area: "Factory Surroundings (បរិវេណរោងចក្រ)",
        category: "Environment",
        checklist: "6S Standard – Factory Environment",
        items: [
            { id: 1, note_en: "Factory main gate and entrance clean and tidy", note_kh: "ខ្លោងទ្វារ និង ច្រកចូលរោងចក្រស្អាត", refImg: "https://images.unsplash.com/photo-1590633711984-75053787752e?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Parking area organized and vehicles parked in lines", note_kh: "កន្លែងចតឡាន ម៉ូតូរៀបចំមានសណ្តាប់ធ្នាប់", refImg: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Common walkways outside buildings swept and clear", note_kh: "ផ្លូវដើរខាងក្រៅអាគារបោសសំអាតស្អាត", refImg: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=500&h=350&fit=crop" },
            { id: 4, note_en: "Waste collection area contained and not overflowing", note_kh: "កន្លែងប្រមូលសម្រាមរៀបចំទុកដាក់ត្រឹមត្រូវ", refImg: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&h=350&fit=crop" },
        ],
    },
    {
        department: "Canteen",
        area: "Staff Canteen (អាហារដ្ឋាន)",
        category: "Support",
        checklist: "6S Standard – Food & Hygiene",
        items: [
            { id: 1, note_en: "Dining tables and chairs wiped clean after use", note_kh: "តុ និង កៅអីញ៉ាំបាយត្រូវបោសសំអាតក្រោយប្រើ", refImg: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Food service counters clean and free of spills", note_kh: "កន្លែងចែកអាហារស្អាត គ្មានកាកសំណល់", refImg: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Hand washing stations stocked with soap and dry", note_kh: "កន្លែងលាងដៃមានសាប៊ូ និង ស្ងួតស្អាត", refImg: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=350&fit=crop" },
        ],
    },
    {
        department: "Office",
        area: "General Office (ការិយាល័យ)",
        category: "Administration",
        checklist: "6S Standard – Office Area",
        items: [
            { id: 1, note_en: "Desks free of unnecessary papers and personal items", note_kh: "លើតុគ្មានឯកសារមិនចាំបាច់ និង របស់ផ្ទាល់ខ្លួន", refImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Filing cabinets labeled and drawers closed when not in use", note_kh: "ទូឯកសារមានស្លាកសញ្ញា និង បិទជិតល្អ", refImg: "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Electrical cables organized and not creating trip hazards", note_kh: "ខ្សែភ្លើងរៀបចំបានល្អ មិនងាយជំពប់ជើង", refImg: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=350&fit=crop" },
        ],
    },
    {
        department: "Maintenance",
        area: "Maintenance Workshop (ផ្នែកថែទាំ)",
        category: "Utility",
        checklist: "6S Standard – Workshop",
        items: [
            { id: 1, note_en: "Tools returned to shadow boards and cleaned after use", note_kh: "ឧបករណ៍ត្រូវយកទៅដាក់លើ shadow board និង សំអាតក្រោយប្រើ", refImg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Workbenches clear and free of old spare parts", note_kh: "តុធ្វើការស្អាត គ្មានគ្រឿងបន្លាស់ចាស់ៗរាយប៉ាយ", refImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Oils and lubricants stored in secondary containment", note_kh: "ប្រេង និង ខ្លាញ់គោត្រូវទុកដាក់លើថាសការពារកំពប់", refImg: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=500&h=350&fit=crop" },
        ],
    },
    {
        department: "Security",
        area: "Guard House & Gate (ផ្នែកសន្តិសុខ)",
        category: "Safety",
        checklist: "6S Standard – Security Post",
        items: [
            { id: 1, note_en: "Security post interior clean and organized", note_kh: "ក្នុងបន្ទប់សន្តិសុខស្អាត និង មានសណ្តាប់ធ្នាប់", refImg: "https://images.unsplash.com/photo-1541884061246-86438096333c?w=500&h=350&fit=crop" },
            { id: 2, note_en: "Visitor log and records up to date and filed", note_kh: "សៀវភៅតាមដានភ្ញៀវមានសណ្តាប់ធ្នាប់ និង ទាន់សម័យ", refImg: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=350&fit=crop" },
            { id: 3, note_en: "Security equipment (mirrors, wands) in good condition", note_kh: "ឧបករណ៍សន្តិសុខ (កញ្ចក់, ម៉ាស៊ីនរាវ) ស្ថិតក្នុងស្ថានភាពល្អ", refImg: "https://images.unsplash.com/photo-1533077155304-1823948acaec?w=500&h=350&fit=crop" },
        ],
    },
];
