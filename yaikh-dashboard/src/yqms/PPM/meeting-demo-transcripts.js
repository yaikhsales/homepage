// Illustrative history for the public YQMS demo. These are not recordings of real meetings.
export const MEETING_TYPES = [
  { id: 'pre-production', label: 'Pre Production', purpose: 'Agree references, materials, risks and the production gate.' },
  { id: 'pilot-run', label: 'Pilot Run', purpose: 'Review trial output before any bulk release.' },
  { id: 'test-sample', label: 'Test Sample', purpose: 'Review sample measurements, tests and buyer comments.' },
];

export const DEMO_MEETINGS = [
  {
    id: 'PPM-DEMO-001', type: 'pre-production', date: '2026-10-19', time: '09:00',
    order: 'YAIDD11', style: '6261340003', buyer: 'Customer BB',
    title: 'Pre Production · construction and fabric review', status: 'PILOT ONLY',
    attendees: 'QA manager, production, technical, cutting, merchandising',
    summary: 'The team agreed the approved sample and tech pack. Neck construction needs a controlled pilot before bulk cutting.',
    transcripts: {
      en: 'QA: We checked the approved sample and revision three tech pack. Production: The neck rib method needs a pilot. Decision: Release material for the identified pilot only. QA will review the first pieces before any bulk cutting.',
      km: 'QA៖ យើងបានពិនិត្យសំណាកដែលបានអនុម័ត និងឯកសារបច្ចេកទេសកំណែទី៣។ ផលិតកម្ម៖ វិធីដេរជាយកត្រូវសាកល្បងជាមុន។ សេចក្តីសម្រេច៖ អនុញ្ញាតសម្ភារៈសម្រាប់ការសាកល្បងដែលបានកំណត់ប៉ុណ្ណោះ។ QA នឹងពិនិត្យផលិតផលដំបូង មុនការកាត់ច្រើន។',
      zh: '质检：我们核对了批准样衣和第三版技术文件。生产：领口罗纹工艺需要先试产。决定：只放行指定试产所需物料。批量裁剪前由质检复核首件。',
    },
  },
  {
    id: 'PILOT-DEMO-001', type: 'pilot-run', date: '2026-10-20', time: '10:30',
    order: 'YAIDD11', style: '6261340003', buyer: 'Customer BB',
    title: 'Pilot Run · first pieces and machine setting', status: 'HOLD',
    attendees: 'QA auditor, line leader, mechanic, operator, technical',
    summary: 'The first trial exposed an uneven neck seam. Correct the feed setting and repeat the pilot before a release decision.',
    transcripts: {
      en: 'Line leader: We produced twenty pilot pieces on line A03. QA: Two pieces show an uneven neck seam. Mechanic: I will correct the feed setting. Decision: Hold the pilot and record a second trial. No bulk sewing release was given.',
      km: 'ប្រធានខ្សែ៖ យើងបានផលិតសាកល្បង ២០ ដុំ នៅខ្សែ A03។ QA៖ មាន ២ ដុំ ដេរថ្នេរកមិនស្មើ។ ជាងម៉ាស៊ីន៖ ខ្ញុំនឹងកែការកំណត់បញ្ជូនក្រណាត់។ សេចក្តីសម្រេច៖ ផ្អាកការសាកល្បង ហើយកត់ត្រាការសាកល្បងលើកទី២។ មិនទាន់អនុញ្ញាតឱ្យដេរច្រើនទេ។',
      zh: '组长：A03 产线完成了二十件试产。质检：其中两件领口缝线不均匀。机修：我会调整送料设置。决定：暂停试产并记录第二轮试验，尚未批准批量车缝。',
    },
  },
  {
    id: 'SAMPLE-DEMO-001', type: 'test-sample', date: '2026-10-21', time: '14:00',
    order: 'YAIDD11', style: '6261340003', buyer: 'Customer BB',
    title: 'Test Sample · measurement and wash review', status: 'PENDING REVIEW',
    attendees: 'QA manager, laboratory, technical, merchandising',
    summary: 'The team reviewed the wash and measurement results. The revised sample remains pending buyer comment.',
    transcripts: {
      en: 'Laboratory: The wash test report is attached. Technical: Body length is within the sample tolerance, and the neck opening needs another check. Merchandising: We will request the buyer comment on revision four. Decision: Keep the test sample pending; do not treat this meeting as production approval.',
      km: 'មន្ទីរពិសោធន៍៖ របាយការណ៍សាកល្បងបោកគក់បានភ្ជាប់មកហើយ។ ផ្នែកបច្ចេកទេស៖ ប្រវែងអាវស្ថិតក្នុងកម្រិតអនុញ្ញាត ប៉ុន្តែរង្វង់កត្រូវពិនិត្យម្តងទៀត។ ផ្នែកពាណិជ្ជកម្ម៖ យើងនឹងស្នើមតិអ្នកទិញលើកំណែទី៤។ សេចក្តីសម្រេច៖ រក្សាសំណាកក្នុងស្ថានភាពរង់ចាំ មិនមែនជាការអនុម័តផលិតកម្មទេ។',
      zh: '实验室：洗水测试报告已附上。技术：衣长在样品公差内，领口还需复查。跟单：我们会征询买家对第四版的意见。决定：测试样品继续待审；本次会议不构成生产批准。',
    },
  },
];
