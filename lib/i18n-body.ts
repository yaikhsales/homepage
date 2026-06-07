"use client";

/* Body-content English → Chinese dictionary for client-side DOM translation.
 *
 * The BodyTranslator walks all text nodes inside <main> and replaces any text
 * whose TRIMMED content matches a key here with the corresponding Chinese
 * value. Keep keys exactly as they appear in JSX (after React fragments are
 * concatenated). Whitespace/newlines inside the text node are preserved by
 * the translator — match on trimmed equality.
 *
 * Add more keys here over time; missing keys simply fall back to English.
 */

export const BODY_TRANSLATIONS: Record<string, string> = {
  // ─── HERO ───
  "Made in Cambodia": "柬埔寨制造",
  "ASEAN": "东盟",
  "Ai-Native Manufacturing": "Ai 原生制造",
  "Intelligence Platform.": "智能平台。",
  "Ai MIP": "Ai MIP",

  // ─── STAT CALLOUTS ───
  "Ai agents stand ready": "10 个 Ai 智能体就绪",
  "Engineers from Cambodia": "柬埔寨工程师",
  "In development": "研发周期",
  "Industry experience (technical + management)": "行业经验(技术 + 管理)",

  // ─── SECTION KICKERS (one per section, in order) ───
  "01 / Executive Summary": "01 / 执行摘要",
  "02 / The Problem": "02 / 存在问题",
  "03 / The Solution": "03 / 解决方案",
  "04 / Architecture": "04 / 产品架构",
  "05 / Agents & Skills": "05 / 智能体与技能",
  "06 / Pricing & Packaging": "06 / 定价与套餐",
  "07 / Target Customers": "07 / 目标客户",
  "08 / Technology": "08 / 技术架构",
  "09 / Team": "09 / 团队",
  "10 / Capital Efficiency": "10 / 资本效率",
  "11 / Go-to-Market Milestones": "11 / 市场推广里程碑",
  "12 / Traction": "12 / 业务进展与试点",
  "13 / OC & Budget": "13 / 运营与实时预算",
  "14 / Competitive Landscape": "14 / 竞争格局",
  "15 / Risks": "15 / 风险与应对",
  "16 / Resources": "16 / 资源需求",
  "17 / About Yai": "17 / 关于 Yai",

  // ─── SECTION TITLES ───
  "Executive Summary": "执行摘要",
  "The Sandwich": "三明治困境",
  "The Solution — An Ai Platform that Saves Jobs": "解决方案 — 拯救工作岗位的 Ai 平台",
  "From Paper to Full Ai — Three Yai Layers": "从纸质到完全 Ai — Yai 的三层架构",
  "The Agents & Their Skills": "智能体及其技能",
  "Pricing & Packaging": "定价与套餐",
  "Target Customers": "目标客户",
  "Technology Stack": "技术架构",
  "Team": "团队",
  "The Capital Efficiency Story": "资本效率故事",
  "Go-to-Market Milestones": "市场推广里程碑",
  "Traction & Pilots": "业务进展与试点",
  "OC & Live Budget Update": "运营委员会与实时预算更新",
  "Competitive Landscape": "竞争格局",
  "Risks & Mitigations": "风险与应对",
  "Resource Requirements": "资源需求",
  "About Yai": "关于 Yai",

  // ─── THESIS STATEMENTS ───
  "Factory-tested for 5 years inside live production facilities — Ai MIP is opening its gates to the industry for the first time.":
    "在真实生产工厂中经过 5 年实地测试 — Ai MIP 首次向行业开放。",
  "One fully integrated platform, left to right — built to upgrade itself as the business progresses.":
    "一个完全集成的平台,从左到右 — 随业务进展自我升级。",
  "Adopt one layer at a time — each builds on the one below, nothing gets ripped out.":
    "一次采纳一层 — 每层基于下层构建,无需拆除任何已有系统。",
  "The full platform, laid out exactly like the live dashboard — Administration, Management, Operations. Every module is an Ai agent. Tap one to hear what it does.":
    "完整平台,布局与实时仪表板完全一致 — 行政、管理、运营。每个模块都是一个 Ai 智能体。点击查看其功能。",
  "All great marches start with one step. That step is $120 a year — five key members stepping up to digitalization. Simple tasks lead all the way to Full Ai in one year. Who would have thought this was possible?":
    "千里之行始于足下。这一步是每年 120 美元 — 五位核心成员迈入数字化。简单任务可在一年内通往完全 Ai。谁能想到这是可能的?",
  "Five customer clusters across Cambodia — each climbs a different segment of the Yai ladder, from $120 admin modules to multi-factory Ai.":
    "柬埔寨五大客户群 — 每个攀登 Yai 阶梯的不同部分,从 120 美元的行政模块到多工厂 Ai。",
  "Different layer, different stack. Cloud SaaS at Layer 1, model-agnostic LLM agents at Layer 2, own-compute on solar at Layer 3 — each tuned for its job, none locked in.":
    "不同层级,不同技术栈。第一层云 SaaS,第二层模型无关的 LLM 智能体,第三层太阳能自有算力 — 各司其职,无任何锁定。",
  "20 engineers across 5 specialised clusters — owner-led, factory-embedded. Adding sales and customer success next.":
    "20 名工程师分布在 5 个专业组 — 创始人领导,工厂驻场。接下来增加销售与客户成功团队。",
  "Built for ~$205K to date and ~$370K through 2027 — what would cost $5M–$10M anywhere else. And the same small dollar in compounds upward — at every Ai layer, the value multiplies.":
    "迄今投入约 20.5 万美元,至 2027 年共约 37 万美元 — 在其他地方需 500-1000 万美元才能完成。同样的小笔投入持续复利 — 每一层 Ai,价值都在倍增。",
  "Quarterly Operating Committee update + half-year budget refresh + capex / purchase applications — delivered on the cadence the parent expects.":
    "季度运营委员会更新 + 半年度预算刷新 + 资本支出/采购申请 — 按母公司期望的节奏交付。",
  "6 tiers of competitors mapped, with prices and weaknesses — but in 90% of Cambodian sales conversations the real opponent is paper, spreadsheets, and 10-year-old legacy. Win the status quo first; outmaneuver SAP regionally.":
    "已绘制 6 层竞争对手图谱,含价格与弱点 — 但在柬埔寨 90% 的销售对话中,真正的对手是纸质流程、电子表格和 10 年前的遗留系统。先击败现状,再在区域上超越 SAP。",
  "Honest about where this could go wrong — and what's in place against each.":
    "坦诚指出可能出错之处 — 以及针对每项的应对措施。",
  "What's needed from the investor over the next 12 months — not a fundraise, a continuation.":
    "未来 12 个月需要投资方提供的支持 — 不是融资,而是延续。",

  // ─── SECTION 1 · EXECUTIVE SUMMARY body ───
  "What it is.": "这是什么。",
  "Yai is": "Yai 是",
  "— Agentic Manufacturing Intelligence. A three-layer platform that modernises your production unit from a whole-paper-based operation into executive Ai. The chaos most factories live in today —":
    " — 智能体制造智能。一个三层平台,将您的生产单位从全纸质运营现代化为高管级 Ai。当今大多数工厂所处的混乱 —",
  "paper reports and ledger books, scattered chat apps, manual signatures, staff running floor-to-floor chasing approvals, calls and pushes by chat":
    "纸质报告与账本、散乱的聊天应用、手工签字、员工逐楼层追踪审批、电话与聊天催办",
  "— is what Yai replaces. The three layers Yai delivers, stacked on top:":
    " — 正是 Yai 所替代的。Yai 提供的三层架构,逐层叠加:",
  "Digitalization layer": "数字化层",
  "(centralised data).": "(集中数据)。",
  "Excel dashboards and digital records flow into one database. Barcode & QR scanners, AIoT sensors, mobile apps and tablets — initial workflow streamlining, one source of truth.":
    "Excel 仪表板与数字记录汇入一个数据库。条码与二维码扫描、AIoT 传感器、移动应用与平板 — 初步流程精简,单一可信数据源。",
  "Agentic layer": "智能体层",
  "(LLM-powered intelligent agents).": "(LLM 驱动的智能体)。",
  "Voice-to-workflow processing, text instructions interpreted by LLM, geolocation & logistics optimisation, intuitive dashboards and DTV (Digital Twin Visualisation), real-time Ai guidance for staff — agents refining workflows.":
    "语音到工作流处理、由 LLM 解读的文本指令、地理位置与物流优化、直观仪表板与 DTV(数字孪生可视化)、面向员工的实时 Ai 指导 — 智能体精炼工作流。",
  "Full Ai layer": "完全 Ai 层",
  "(strategic management & growth).": "(战略管理与增长)。",
  "Higher-level management decision-making, strategic planning with Ai insights, predictive business growth, multi-factory management, business expansion and global growth.":
    "更高层级的管理决策、基于 Ai 洞察的战略规划、预测性业务增长、多工厂管理、业务扩张与全球增长。",

  // ─── SECTION 2 · THE SANDWICH (Problem) ───
  "Corner 1 · Brand": "角落 1 · 品牌",
  "Corner 2 · Government": "角落 2 · 政府",
  "Corner 3 · Management": "角落 3 · 管理层",
  "Corner 4 · Staff & Workers": "角落 4 · 员工与工人",
  "The Owner · Sandwiched": "工厂主 · 夹在中间",
  "The brand is upgrading": "品牌正在升级",
  "The government is mandating": "政府正在强制",
  "Management hitting the wall": "管理层撞上瓶颈",
  "Workers don't resist change": "工人并不抗拒变革",
  "Caught in the middle — ~20 systems, $2M sunk, zero integration":
    "夹在中间 — 约 20 个系统、200 万美元沉没成本、零整合",

  // ─── SECTION 9 · Team ───
  "Engineering — 5 clusters · 20 engineers": "工程团队 — 5 个组 · 20 名工程师",
  "Cambodia-based. Each cluster owns its slice of the platform end-to-end.":
    "驻柬埔寨。每个组端到端负责平台的对应部分。",

  // ─── SECTION 10 · Capital Efficiency ───
  "How ~$205K built 17 module families": "约 20.5 万美元如何构建 17 个模块家族",

  // ─── SECTION 11 · GTM ───
  "GTM foundation — what makes the milestones possible":
    "市场推广基础 — 让里程碑成为可能的要素",
  "Three enablers sit underneath every segment milestone below. Without these, even a good segment plan stalls.":
    "三项推动力支撑下方每个细分市场的里程碑。缺少它们,即便是好的细分计划也会停滞。",
  "Go-to-Market — approach & milestones per segment":
    "市场推广 — 各细分市场的方法与里程碑",
  "Each market segment has its own approach and its own progress. ✓ = done · ◐ = in progress · ○ = planned.":
    "每个市场细分都有各自的方法和进展。✓ = 已完成 · ◐ = 进行中 · ○ = 计划中。",

  // ─── SECTION 13 · OC & Budget ───
  "Quarterly OC update": "季度运营委员会更新",
  "Half-year budget refresh": "半年度预算刷新",
  "Purchase applications": "采购申请",
  "Cadence": "节奏",
  "Format": "格式",
  "Arnold's template": "Arnold 的模板",
  "Live P&L roll-up · 2024 → today": "实时损益汇总 · 2024 → 至今",
  "Sourced from admin · Sales · Salaries · Expenses":
    "来源:后台 · 销售 · 薪资 · 支出",
  "Q1 · Q2 · Q3 · Q4": "Q1 · Q2 · Q3 · Q4",
  "March · September": "三月 · 九月",

  // ─── SECTION 17 · About Yai ───
  "A1. Company credentials": "A1. 公司资质",
  "A2. Product preview": "A2. 产品预览",
  "A3. Contact": "A3. 联系方式",
  "Public-facing proof of legitimacy — Cambodian business registration, VAT certificate, ICT licence.":
    "对外的合法性证明 — 柬埔寨营业执照、增值税证书、信息通信技术许可证。",
  "What Yai looks like in production — the worker-facing front UI + the agentic chat layer.":
    "Yai 在生产中的样貌 — 工人端前端界面 + 智能体聊天层。",
  "Business Registration": "营业执照",
  "VAT Certificate": "增值税证书",
  "ICT License": "信息通信许可证",
  "Front UI": "前端界面",
  "Agentics": "智能体",

  // ─── FOOTER ───
  "Confidential — Yai / Texlink Technologies Co., Ltd.":
    "机密 — Yai / 德领科技有限公司",
  "By accessing this page you agree not to share its contents without permission.":
    "访问本页面即表示您同意未经许可不分享其内容。",

  // ─── COMMON labels ───
  "Agents in action": "智能体实战",
  "What a conversation with Yai actually looks like":
    "与 Yai 的对话实际是什么样",
  "A real interaction: a supervisor asks the Finance agent for the payroll summary, it pulls the data, then prepares the WRAP audit pack on request. No clicking through 12 screens.":
    "真实交互:主管向财务智能体询问薪资汇总,智能体拉取数据,然后按需准备 WRAP 审计资料包。无需点击 12 个屏幕。",
};

/** Lookup helper. Returns the Chinese translation or undefined if not in dict. */
export function translateBody(en: string): string | undefined {
  return BODY_TRANSLATIONS[en];
}
