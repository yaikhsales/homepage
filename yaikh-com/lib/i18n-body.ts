"use client";

/* Body-content English → Chinese dictionary for client-side DOM translation.
 *
 * The BodyTranslator walks all text nodes inside <main> and replaces any text
 * whose TRIMMED content matches a key here with the corresponding Chinese
 * value. Keys must match what React renders as a single text node.
 *
 * Comprehensive — covers all visible body text across Sections 1-17, the hero,
 * sidebar pieces, stat callouts, tech-stack chips, pricing staircase, team
 * clusters, GTM enabler text, competitive landscape, risks, resources, and
 * the About section. Missing keys silently fall back to English.
 */

export const BODY_TRANSLATIONS: Record<string, string> = {
  // ─────────────── HERO ───────────────
  "Made in Cambodia": "柬埔寨制造",
  "ASEAN": "东盟",
  "Ai-Native Manufacturing": "Ai 原生制造",
  "Intelligence Platform.": "智能平台。",
  "Ai MIP": "Ai MIP",

  // ─────────────── STAT CALLOUTS ───────────────
  "Ai agents stand ready": "Ai 智能体就绪",
  "Engineers from Cambodia": "柬埔寨工程师",
  "In development": "研发周期",
  "Industry experience (technical + management)": "行业经验(技术 + 管理)",

  // ─────────────── SECTION KICKERS ───────────────
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

  // ─────────────── SECTION TITLES ───────────────
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

  // ─────────────── THESIS STATEMENTS ───────────────
  "Factory-tested for 5 years inside live production facilities — Ai MIP is opening its gates to the industry for the first time.":
    "在真实生产工厂中经过 5 年实地测试 — Ai MIP 首次向行业开放。",
  "One fully integrated platform, left to right — built to upgrade itself as the business progresses.":
    "一个完全集成的平台,从左到右 — 随业务进展自我升级。",
  "Adopt one layer at a time — each builds on the one below, nothing gets ripped out.":
    "一次采纳一层 — 每层基于下层构建,无需拆除任何已有系统。",
  "The full platform, laid out exactly like the live dashboard — Administration, Management, Operations. Every module is an Ai agent. Tap one to hear what it does.":
    "完整平台,布局与实时仪表板完全一致 — 行政、管理、运营。每个模块都是一个 Ai 智能体。点击聆听其功能。",
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

  // ─────────────── SECTION 1 · EXECUTIVE SUMMARY ───────────────
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

  // ─────────────── SECTION 2 · THE SANDWICH ───────────────
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

  // ─────────────── SECTION 3 · SOLUTION ───────────────
  "Answers Corner 1 · Brand": "回应角落 1 · 品牌",
  "Answers Corner 2 · Government": "回应角落 2 · 政府",
  "Answers The Owner · Sandwiched": "回应工厂主 · 夹在中间",
  "Answers Corner 3 · Management": "回应角落 3 · 管理层",
  "Answers Corner 4 · Staff & Workers": "回应角落 4 · 员工与工人",
  "Buyer-endorsed — don't reinvent the wheel": "品牌方背书 — 无需重新发明轮子",
  "Compliance on autopilot": "合规自动化",
  "One platform, not twenty": "一个平台,而非二十个",
  "Management gets its time back": "管理层赢回时间",
  "Built for the floor": "为车间量身打造",

  // ─────────────── SECTION 4 · STAGE LADDER (Architecture) ───────────────
  "LAYER 3": "第 3 层",
  "LAYER 2": "第 2 层",
  "LAYER 1": "第 1 层",
  "TODAY": "现状",
  "Full Ai": "完全 Ai",
  "Agentic": "智能体",
  "Digitalization": "数字化",
  "Traditional Factory Work": "传统工厂作业",
  "Strategic management & growth": "战略管理与增长",
  "LLM-powered intelligent agents": "LLM 驱动的智能体",
  "Centralised data": "集中数据",
  "Disconnected & manual — what Yai replaces": "脱节且手动 — 正是 Yai 所替代",
  "Executive layer — senior management decisions, multi-factory control, expansion to new countries. At this level companies run their own Ai compute on solar-powered mini data centres — cost down, sustainability up.":
    "高管层 — 高层管理决策、多工厂管控、扩展至新国家。此层企业在太阳能小型数据中心运行自有 Ai 算力 — 成本下降,可持续性上升。",
  "Ai agents refine workflows. Voice, text, dashboards and digital-twin visualisation on every device.":
    "Ai 智能体精炼工作流。语音、文本、仪表板与数字孪生可视化贯穿所有设备。",
  "Excel dashboards and digital records flow into one database. The foundation for everything above.":
    "Excel 仪表板与数字记录汇入一个数据库。是上层一切的根基。",
  "The reality most garment factories are stuck in today. Yai doesn't deliver this layer; it replaces it.":
    "这是当今大多数制衣厂仍困在其中的现实。Yai 不交付这一层 — 它取代它。",
  // StageLadder icon labels
  "Multi-country": "跨国管控",
  "Predictive growth": "预测增长",
  "Executive decisions": "高管决策",
  "Strategic Ai insights": "战略 Ai 洞察",
  "Multi-factory": "多工厂",
  "Own Ai computing": "自有 Ai 算力",
  "Solar-powered mini data centre": "太阳能小型数据中心",
  "Voice-to-workflow": "语音到工作流",
  "LLM agents": "LLM 智能体",
  "Dashboards & DTV": "仪表板与 DTV",
  "Real-time guidance": "实时指导",
  "Geo & logistics": "地理与物流",
  "One database": "单一数据库",
  "Digital records": "数字记录",
  "Mobile apps": "移动应用",
  "Tablets": "平板设备",
  "AIoT & scanners": "AIoT 与扫描枪",
  "Paper reports": "纸质报告",
  "Ledger books": "账本",
  "Scattered chat": "散乱聊天",
  "Manual signing": "手工签字",
  "Chasing approvals": "追逐审批",
  "Evolution": "演进",

  // ─────────────── SECTION 5 · MODULES ───────────────
  "Agents in action": "智能体实战",
  "What a conversation with Yai actually looks like": "与 Yai 的对话实际是什么样",
  "A real interaction: a supervisor asks the Finance agent for the payroll summary, it pulls the data, then prepares the WRAP audit pack on request. No clicking through 12 screens.":
    "真实交互:主管向财务智能体询问薪资汇总,智能体拉取数据,然后按需准备 WRAP 审计资料包。无需点击 12 个屏幕。",

  // ─────────────── SECTION 6 · PRICING ───────────────
  "Step 1": "第一步",
  "Step 2": "第二步",
  "Step 3": "第三步",
  "Step 4": "第四步",
  "Step 5": "第五步",
  "Step 6": "第六步",
  "Step 4 · Total": "第四步 · 合计",
  "Cloud · Starter": "云 · 入门版",
  "Cloud · Growth": "云 · 成长版",
  "Cloud · Enterprise": "云 · 企业版",
  "Ai Server": "Ai 服务器",
  "Administrative": "管理行政",
  "Operation": "运营",
  "tools": "工具",
  "Big Ai Brain": "大 Ai 大脑",
  "5 key members": "5 位核心成员",
  "5 – 300 users": "5 – 300 用户",
  "300 – 1,000 users": "300 – 1,000 用户",
  "Hardware · 1,000+ users": "硬件 · 1,000+ 用户",
  "After ~6 months": "约 6 个月后",
  "Boss · after ~1 year": "老板 · 约 1 年后",
  "/ year": "/ 年",
  "/ year · 10 agents + 35 mini": "/ 年 · 10 个智能体 + 35 个迷你智能体",
  "/ year · talks across 5+ factories": "/ 年 · 跨 5+ 工厂对话",
  "once · hardware + setup": "一次性 · 硬件 + 安装",
  "Buy $2,500": "购买 $2,500",
  "✓ Bought": "✓ 已购买",
  "tap to see what's next": "点击查看下一步",
  "🔒 Locked": "🔒 已锁定",
  "✓ Activated": "✓ 已激活",
  "Activate": "激活",
  "tap to activate": "点击激活",
  "buy server first": "请先购买服务器",
  "$2,500 paid": "已支付 $2,500",
  "not yet": "尚未",
  "Server": "服务器",
  "Yearly · active": "年度 · 已激活",
  "Chaos → Digitalization": "混乱 → 数字化",
  "5 · core team": "5 · 核心团队",
  "5 → 300 · dept": "5 → 300 · 部门",
  "300 → 1,000 · factory": "300 → 1,000 · 工厂",
  "+ many others": "+ 多个其他",
  "5 factories": "5 个工厂",
  "1 chat": "1 个对话",
  "Each step builds on the one before.": "每一步都建立在前一步之上。",
  "Buy the Ai server first ($2,500)": "先购买 Ai 服务器 ($2,500)",
  ", then tap to activate Administrative ($5K/yr) and/or Operation ($10K/yr).":
    ",然后点击激活管理行政 ($5K/年) 与/或 运营 ($10K/年)。",

  // ─────────────── SECTION 7 · TARGET CUSTOMERS ───────────────
  "Mid-size Cambodia factories": "柬埔寨中型工厂",
  "E-commerce cluster": "电商集群",
  "Small factories": "小型工厂",
  "Non-garment companies": "非制衣行业企业",
  "Government / Institutional Collaboration": "政府/机构合作",
  "$120 → $15,000 / yr": "$120 → $15,000 / 年",
  "Mixed pricing": "混合定价",
  "$750 – $1,200 / yr": "$750 – $1,200 / 年",
  "$120 – $750 / yr": "$120 – $750 / 年",
  "Partnership-based · projected biggest": "合作型 · 预计最大",
  "Garment, bag, footwear. ~300 may stop at Digitalization, ~500 climb the full ladder to Ai.":
    "制衣、箱包、鞋类。约 300 家可能止步于数字化,约 500 家攀登整条 Ai 阶梯。",
  "Three sub-clusters across online commerce.": "三个在线商务子集群。",
  "Cloud Growth / Enterprise comfort zone. Rarely escalate to dedicated server or Ai.":
    "云成长/企业版舒适区。极少升级到独立服务器或 Ai。",
  "Various industries using the administrative modules only. Cloud Starter to Cloud Growth.":
    "仅使用行政模块的多个行业。云入门版到云成长版。",
  "First meeting with the Minister of Environment ✓ — Digital Audit collaboration agreed; the minister tasked his advisor to propose Yai for the ASEAN Tech Summit presentation. Government bodies + industry institutions together — projected to be the LARGEST cluster of all.":
    "与环境部部长首次会面 ✓ — 数字审计合作已达成共识;部长责成顾问提议 Yai 进行东盟科技峰会演讲。政府机构 + 行业协会共同 — 预计成为所有集群中最大的。",
  "Small sales": "小型销售",
  "Service market": "服务市场",
  "Factory supply market": "工厂供给市场",
  "Factory supply": "工厂供给",
  "100,000 workers": "10 万工人",
  "~1,000 providers": "约 1,000 服务商",
  "TBD": "待定",
  "workers": "工人",
  "to all factories": "面向所有工厂",
  "market": "市场",
  "Engagements lined up": "已排期接洽",
  "Ministry of Environment ✓": "环境部 ✓",
  "Labour": "劳工部",
  "Industry": "工业部",
  "Telecom": "电信部",
  "Economics": "经济部",
  "Commerce": "商务部",
  "Digital Government": "数字政府",
  "ILO Better Work": "ILO Better Work",
  "GMAC": "GMAC",
  "TAFTAC": "TAFTAC",
  "ASEAN Tech Summit": "东盟科技峰会",
  "Total reachable": "可触达总数",
  "customers": "客户",
  "GOV +": "政府 +",
  "INST.": "机构。",
  "Pipeline": "管线",

  // ─────────────── SECTION 8 · TECH STACK ───────────────
  "Full Ai · sovereign compute": "完全 Ai · 主权算力",
  "Agentic · model-agnostic": "智能体 · 模型无关",
  "Digitalization · the foundation": "数字化 · 根基",
  "What Yai replaces · the old tech": "Yai 所替代的 · 旧技术",
  "On-site Ai · solar-powered · multi-factory mesh":
    "本地 Ai · 太阳能驱动 · 多工厂网格",
  "Swappable LLMs · voice + chat + dashboards":
    "可替换的 LLM · 语音 + 对话 + 仪表板",
  "Cloud-first SaaS · mobile-native · AIoT-connected":
    "云优先 SaaS · 移动原生 · AIoT 互联",
  "Paper · ledgers · scattered chat · manual signatures":
    "纸质 · 账本 · 散乱聊天 · 手工签字",
  "NVIDIA": "英伟达",
  "AMD": "AMD",
  "Huawei": "华为",
  "Llama": "Llama",
  "Qwen": "千问",
  "DeepSeek": "DeepSeek",
  "Solar": "太阳能",
  "Edge": "边缘",
  "GPU": "GPU",
  "Ascend": "昇腾",
  "Meta": "Meta",
  "Alibaba": "阿里",
  "open": "开源",
  "mini DC": "迷你 DC",
  "mesh": "网格",
  "Claude": "Claude",
  "GPT": "GPT",
  "Gemini": "Gemini",
  "Open-source": "开源",
  "Voice": "语音",
  "Chat": "对话",
  "DTV": "DTV",
  "Anthropic": "Anthropic",
  "OpenAI": "OpenAI",
  "Google": "Google",
  "self-host": "自托管",
  "to workflow": "至工作流",
  "agent ops": "智能体运维",
  "twin view": "孪生视图",
  "tri-lingual": "三语言",
  "Cloud": "云",
  "Laravel": "Laravel",
  "MongoDB": "MongoDB",
  "Android": "安卓",
  "iOS": "iOS",
  "AIoT": "AIoT",
  "RFID": "RFID",
  "Biometric": "生物识别",
  "ABA · Wing": "ABA · Wing",
  "shared SaaS": "共享 SaaS",
  "PHP": "PHP",
  "data": "数据",
  "native": "原生",
  "sensors": "传感器",
  "tracking": "追踪",
  "attendance": "考勤",
  "payouts": "付款",
  "Paper": "纸质",
  "Ledgers": "账本",
  "Excel": "Excel",
  "WhatsApp": "WhatsApp",
  "Manual": "手工",
  "Chasing": "追逐",
  "reports": "报告",
  "books": "账本",
  "scattered": "散乱",
  "chat chaos": "聊天混乱",
  "signing": "签字",
  "approvals": "审批",

  // ─────────────── SECTION 9 · TEAM ───────────────
  "Engineering — 5 clusters · 20 engineers": "工程团队 — 5 个组 · 20 名工程师",
  "Cambodia-based. Each cluster owns its slice of the platform end-to-end.":
    "驻柬埔寨。每个组端到端负责平台的对应部分。",

  // ─────────────── SECTION 10 · CAPITAL EFFICIENCY ───────────────
  "How ~$205K built 17 module families": "约 20.5 万美元如何构建 17 个模块家族",

  // ─────────────── SECTION 11 · GTM ───────────────
  "GTM foundation — what makes the milestones possible":
    "市场推广基础 — 让里程碑成为可能的要素",
  "Three enablers sit underneath every segment milestone below. Without these, even a good segment plan stalls.":
    "三项推动力支撑下方每个细分市场的里程碑。缺少它们,即便是好的细分计划也会停滞。",
  "Go-to-Market — approach & milestones per segment":
    "市场推广 — 各细分市场的方法与里程碑",
  "Each market segment has its own approach and its own progress. ✓ = done · ◐ = in progress · ○ = planned.":
    "每个市场细分都有各自的方法与进展。✓ = 已完成 · ◐ = 进行中 · ○ = 计划中。",
  "Exhibitions & Events (Offline)": "展会与活动(线下)",
  "Marketing & Sales Personnel": "市场与销售人员",
  "Clear Sales & Promotion Steps": "清晰的销售与推广步骤",
  "OFFLINE": "线下",
  "TEAM": "团队",
  "PROCESS": "流程",
  "Channel": "渠道",
  "Funnel": "漏斗",
  "Trade shows · summits": "展会 · 峰会",
  "5 hired · CC 101": "5 人已招 · CC 101",
  "4-step + 5 channels": "4 步骤 + 5 渠道",
  "Cambodia is still a relationship-first market. Owner-trust gets built face-to-face — trade shows, GMAC / TAFTAC events, ministry summits. Yai needs a physical presence where decision-makers gather, not just an online funnel.":
    "柬埔寨仍是关系优先的市场。工厂主的信任靠面对面建立 — 展会、GMAC / TAFTAC 活动、部委峰会。Yai 需要在决策者聚集的地方有实体存在,而不仅是在线漏斗。",
  "5 sales people · 60% factory-industry experience · 30% presentation + training · 10% software / Ai-native. Mindset-shift work: convincing factory mid + top mgmt to step up through Digitalization → Agentic → Full Ai. All Claude Code 101 certified.":
    "5 名销售 · 60% 工厂行业经验 · 30% 演示 + 培训 · 10% 软件 / Ai 原生。思维转换工作:说服工厂中层与高层逐步迈过数字化 → 智能体 → 完全 Ai。全员持 Claude Code 101 认证。",
  "Primary funnel: printed invitation → weekly 15-20 min online demo → on-site in-person presentation → package commitment ($120 / $750 / $1,000+). Parallel channels: government top-down, app user growth (2.5K → 100K), word of mouth, non-garment expansion.":
    "主漏斗:印制邀请函 → 每周 15-20 分钟在线演示 → 现场亲临演讲 → 套餐承诺 ($120 / $750 / $1,000+)。并行渠道:政府自上而下、App 用户增长 (2.5K → 100K)、口碑传播、非制衣扩展。",
  "GOV + INST.": "政府 + 机构。",
  "Government & Institutional": "政府与机构",
  "SMALL FACTORIES": "小型工厂",
  "E-COM": "电商",
  "NON-GARMENT": "非制衣",
  "BIG TECH": "大科技",
  "MID-SIZE": "中型",
  "Partnership-based · projected biggest cluster. Ministries + industry bodies together.":
    "合作型 · 预计最大集群。部委 + 行业机构联合。",
  "$120 – $1,200 / yr · Cloud Starter / Growth comfort zone. Rarely escalate to dedicated server or full Ai.":
    "$120 – $1,200 / 年 · 云入门版/成长版舒适区。极少升级到独立服务器或完全 Ai。",
  "E-commerce cluster — Worker P2P + Marketplaces": "电商集群 — 工人 P2P + 市场",
  "Mixed pricing across three sub-clusters of online commerce — Worker P2P, Service Providers, Factory Supply.":
    "三个在线商务子集群的混合定价 — 工人 P2P、服务商、工厂供给。",
  "$120 – $750 / yr · Various industries (hospitality, food, logistics, services) using the admin modules only. Cloud Starter to Cloud Growth.":
    "$120 – $750 / 年 · 多行业(酒店、餐饮、物流、服务业)仅使用行政模块。云入门版到云成长版。",

  // ─────────────── SECTION 13 · OC & BUDGET ───────────────
  "Quarterly OC update": "季度运营委员会更新",
  "Half-year budget refresh": "半年度预算刷新",
  "Purchase applications": "采购申请",
  "Every 3 months. Short deck or written brief — KPIs vs targets, wins / losses, cash & burn, risks, decisions the OC needs to make.":
    "每 3 个月一次。简短演示或书面简报 — KPI 对比目标、得失、现金与燃烧率、风险、运营委员会需做的决策。",
  "Every 6 months. Refreshed FY P&L forecast — revenue, costs, headcount, capex — with variance vs the original year-start plan.":
    "每 6 个月一次。刷新财年损益预测 — 收入、成本、人员、资本支出 — 含与原年初计划的差异。",
  "Submitted alongside the half-year budget. Larger purchases needing OC sign-off before commitment — equipment, software, contractors, hires above threshold.":
    "随半年度预算一同提交。承诺前需运营委员会批准的较大采购 — 设备、软件、外包、超过阈值的招聘。",
  "Cadence": "节奏",
  "Format": "格式",
  "Arnold's template": "Arnold 的模板",
  "Q1 · Q2 · Q3 · Q4": "Q1 · Q2 · Q3 · Q4",
  "March · September": "三月 · 九月",
  "Live P&L roll-up · 2024 → today": "实时损益汇总 · 2024 → 至今",
  "Sourced from admin · Sales · Salaries · Expenses": "来源:后台 · 销售 · 薪资 · 支出",
  "01 INCOME": "01 收入",
  "02 EXPENSES": "02 支出",
  "03 CAPEX": "03 资本支出",
  "04 NET": "04 净额",
  "Income": "收入",
  "Expenses": "支出",
  "Capex": "资本支出",
  "Net": "净额",

  // ─────────────── SECTION 14 · COMPETITION ───────────────
  "Tier 1 · Global ERP titans": "第 1 层 · 全球 ERP 巨头",
  "Tier 2 · Apparel-specific platforms": "第 2 层 · 制衣专属平台",
  "Tier 3 · Open-source ERP": "第 3 层 · 开源 ERP",
  "Tier 4 · Regional Chinese tools": "第 4 层 · 区域中文工具",
  "Tier 5 · Garment-floor point tools": "第 5 层 · 车间点工具",
  "Tier 6 · Status quo": "第 6 层 · 现状",
  "Weakness": "弱点",

  // ─────────────── SECTION 15 · RISKS ───────────────
  "Market adoption risk": "市场采用风险",
  "Ai cost economics": "Ai 成本经济性",
  "Competitive response": "竞争对手反应",
  "Investor scope timing": "投资方范围时机",
  "Talent retention": "人才保留",
  "Factories may move slower than projected; budgets are tight, IT change-resistant.":
    "工厂行动可能比预期慢;预算紧张,IT 抗拒变革。",
  "Three parallel channels (direct, government, bottom-up). Low-cost Stage 1 entry. Reference customers already live.":
    "三条并行渠道(直销、政府、自下而上)。低成本第 1 阶段入门。已有标杆客户运行中。",
  "LLM API costs eat margin; token usage scales unpredictably.":
    "LLM API 成本侵蚀利润;Token 用量增长不可预测。",
  "Model-agnostic architecture — switch providers as economics shift. Caching, prompt optimisation, and tier-based token allowances. Self-hosted model option for high-volume customers.":
    "模型无关架构 — 随经济性变化切换供应商。缓存、提示优化、分层 Token 配额。大用量客户可选自托管模型。",
  "SAP, Oracle, or Odoo launch regionally-priced apparel SKUs.":
    "SAP、Oracle 或 Odoo 推出区域定价的制衣 SKU。",
  "Cost-of-engineering advantage (15–28×). Trilingual + apparel-specific positioning is structural, not feature-based. Established government partnerships create switching cost.":
    "工程成本优势(15-28 倍)。三语 + 制衣专属定位是结构性的,非功能性的。已建立的政府合作产生切换成本。",
  "Decisions on commercialising production modules slip, delaying revenue.":
    "生产模块商业化决策推迟,延后收入。",
  "Admin-tier commercialisation is independently viable. Production-tier is upside, not dependency.":
    "行政层商业化独立可行。生产层属上行空间,非依赖项。",
  "Senior engineers poached as Yai's reputation grows.":
    "随着 Yai 声誉提升,资深工程师被挖角。",
  "Equity participation for key engineers. Strong founder relationships. Cambodia-based team — limited local competition for Ai-native talent at this depth.":
    "核心工程师参与股权。创始人关系牢固。柬埔寨本地团队 — 在此深度的 Ai 原生人才本地竞争有限。",

  // ─────────────── SECTION 16 · RESOURCES ───────────────
  "1. Continuation of current funding rate": "1. 延续当前资金水平",
  "2. Sales hire budget approval": "2. 销售招聘预算批准",
  "3. Strategic introductions": "3. 战略引荐",
  "4. Ministry partnership sign-off": "4. 部委合作签字",
  "5. Expansion conversation in Q3–Q4": "5. Q3-Q4 扩展对话",
  "6. Brand permission for case studies": "6. 案例研究的品牌授权",
  "No step-up in capital required. Maintain current monthly run rate to keep the engineering team intact through the commercialisation phase.":
    "无需增加资本投入。维持当前月度运行率,在商业化阶段保持工程团队完整。",
  "$TBD / year fully loaded for 1–2 apparel-industry sales hires. Specific candidates and economic case to be tabled separately.":
    "1-2 名制衣行业销售年度全成本约 $TBD。具体候选人与经济测算另行提交。",
  "Ministry contacts, brand HQ relationships (Adidas, Levi's, H&M, Uniqlo etc.), buyer compliance teams. Warm introductions short-circuit months of cold outreach.":
    "部委联系人、品牌总部关系(阿迪达斯、Levi's、H&M、优衣库等)、买家合规团队。热引荐可省去数月冷接触。",
  "Authority to finalise terms with Ministry of Environment on the digital audit module — non-revenue at ministry level, revenue-generating at factory level.":
    "授权与环境部就数字审计模块敲定条款 — 部委层面非营收,工厂层面产生收入。",
  "Based on Q1–Q3 results, structured conversation on (a) regional expansion velocity, (b) production module commercialisation, (c) follow-on investment if warranted.":
    "基于 Q1-Q3 结果,就(a)区域扩展速度,(b)生产模块商业化,(c)如有必要的后续投资进行结构化对话。",
  "Approval to use the live pilot factories as named case studies (or carefully anonymised) for sales reference and seminar content.":
    "批准将在用试点工厂作为具名案例研究(或谨慎匿名)用于销售参考与研讨会内容。",

  // ─────────────── SECTION 17 · ABOUT YAI ───────────────
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
  "Upload from /admin/about": "从 /admin/about 上传",

  // ─────────────── COMMON STATUS / MARKERS ───────────────
  "done": "已完成",
  "progress": "进行中",
  "planned": "计划中",
  "Done": "已完成",
  "In progress": "进行中",
  "Planned": "计划中",

  // ─────────────── FOOTER ───────────────
  "Confidential — Yai / Texlink Technologies Co., Ltd.": "机密 — Yai / 德领科技有限公司",
  "By accessing this page you agree not to share its contents without permission.":
    "访问本页面即表示您同意未经许可不分享其内容。",

  // ─────────────── INLINE FRAGMENTS often appearing ───────────────
  "Credentials, product preview, and contact. Image slots are admin-managed from":
    "资质、产品预览与联系方式。图片插槽由后台管理,路径:",
  ".": "。",

  // ─────────────── ROLES / TAGS commonly visible ───────────────
  "Director": "总监",
  "Texlink Technologies": "德领科技",
  "Strategic DTV": "战略数字工业",

  // ─────────────── §11 · SALES EXPENSES AND BUDGET (LiveBudgetSummary) ───────────────
  "Sales Expenses and Budget": "销售支出与预算",
  "Sales / Income": "销售 / 收入",
  "11 streams — 8 planned packages (Cloud × 3 · Ai Server · Admin Tools · Ops Tools · Agentic · Big Ai Brain) + 3 variable-reach e-com streams. Tracking starts Jun 2026.":
    "11 条业务流 — 8 个计划套餐(云 × 3 · Ai 服务器 · 行政工具 · 运营工具 · 智能体 · 大 Ai 脑)+ 3 条可变触达电商流。2026 年 6 月起跟踪。",
  "Salaries · compensation paid": "薪资 · 已付报酬",
  "#1 members tracked from May #2 onward. Includes bonuses.":
    "自 #2 年 5 月起跟踪 #1 名成员。含奖金。",
  "Capex + running costs": "资本支出 + 运营成本",
  "#1 categories — Computers, Furniture, Dev gear, Admin Shop, Ai Fees, Villa Rent, Petty Cash + Promotion.":
    "#1 个类别 — 电脑、家具、开发设备、行政采购、Ai 费用、别墅租金、零用金 + 推广。",
  "Net position · investment build": "净头寸 · 投资构建",
  "Income − (Salaries + Capex). Negative is expected during the platform-build phase — see Section 10 for the asset-value offset.":
    "收入 −(薪资 + 资本支出)。平台建设阶段出现负值属预期 — 资产价值抵消见第 10 节。",
  "Actual": "实际",
  "Paid": "已付",
  "Spent": "已支出",
  "Today": "今日",
  "Status": "状态",
  "Hide detail": "收起详情",
  "Detail": "详情",
  "Income · quarterly": "收入 · 季度",
  "Salaries · quarterly": "薪资 · 季度",
  "Capex · quarterly": "资本支出 · 季度",
  "Quarterly · revenue vs cost": "季度 · 收入对比成本",
  "Revenue (up)": "收入(上)",
  "Cost (down)": "成本(下)",
  "No data yet — admin posts will appear here.": "暂无数据 — 后台发布后将显示于此。",
  "Detailed Sheet": "详细表格",
  "Sourced live from admin · Sales · Salaries · Expenses.": "数据实时来源于后台 · 销售 · 薪资 · 支出。",
  "Last update": "最后更新",

  // ─────────────── /plan/sales-sheet (read-only detailed grid) ───────────────
  "Yai · Strategic DTV": "Yai · 战略数字工业",
  "Sales / Income — Detailed Sheet": "销售 / 收入 — 详细表格",
  "Read-only view.": "只读视图。",
  "= forecast ·": "= 预测 ·",
  "= booked / closed ·": "= 已成交 / 已结 ·",
  "= who signed that month.": "= 当月签约客户。",
  "Planned total": "计划总额",
  "Actual total": "实际总额",
  "Stream": "业务流",
  "Unit price": "单价",
  "Row": "行",
  "Total": "总计",
  "Clients": "客户",
  "Monthly total · Planned": "月度总计 · 计划",
  "Monthly total · Actual": "月度总计 · 实际",
  "Confidential — Yai / Texlink Technologies Co., Ltd. Sourced live from admin · Sales.":
    "机密 — Yai / 德领科技有限公司。数据实时来源于后台 · 销售。",

  // Stream names + tier/unit labels (defaults of the admin Sales store)
  "Cloud Starter": "云入门版",
  "Cloud Growth": "云成长版",
  "Cloud Enterprise": "云企业版",
  "Ai Server": "Ai 服务器",
  "Administrative Tools": "行政工具",
  "Operation Tools": "运营工具",
  "Agentic": "智能体",
  "Big Ai Brain": "大 Ai 脑",
  "Worker P2P Marketplace": "工人 P2P 市场",
  "Service Provider Marketplace": "服务商市场",
  "Factory Supply Marketplace": "工厂供给市场",
  "5 key members": "5 名关键成员",
  "5 → 300 users · whole department": "5 → 300 用户 · 整个部门",
  "300 → 1,000 users · whole factory": "300 → 1,000 用户 · 整个工厂",
  "1,000+ users · dedicated server": "1,000+ 用户 · 独立服务器",
  "Activated after Ai Server · admin module stack": "Ai 服务器之后启用 · 行政模块栈",
  "Activated after Ai Server · ops module stack": "Ai 服务器之后启用 · 运营模块栈",
  "After ~6 months · 10 agents + 35 mini": "约 6 个月后 · 10 个智能体 + 35 个迷你",
  "Boss · after ~1 year · 5 factories 1 chat": "老板 · 约 1 年后 · 5 厂 1 聊天",
  "Planned reach: 100,000 garment workers": "计划触达:100,000 名制衣工人",
  "Planned reach: ~1,000 service providers": "计划触达:约 1,000 家服务商",
  "Planned reach: 100 curated SKUs · target $100K GMV / month":
    "计划触达:100 个精选 SKU · 目标月 GMV $100K",
  "Take-rate · variable / user": "抽成 · 浮动 / 用户",
  "Take-rate + listing · variable / provider": "抽成 + 上架 · 浮动 / 服务商",
  "Wholesale margin · variable / SKU": "批发差价 · 浮动 / SKU",
  "#1 / yr": "#1 / 年",
  "#1 (one-off)": "#1(一次性)",
  "#1 users": "#1 用户",
};

/** Lookup helper. Returns the Chinese translation or undefined if not in dict. */
export function translateBody(en: string): string | undefined {
  return BODY_TRANSLATIONS[en];
}

/** Number token — digits with optional $, thousands separators, decimals, %/+ suffix. */
const NUM_RE = /\$?\d[\d,]*(?:\.\d+)?[%+]?/g;

/**
 * Smarter lookup for the DOM translator:
 * 1. exact match (after collapsing inner whitespace — JSX line wraps insert
 *    newlines mid-sentence, which used to break lookups);
 * 2. number-pattern match — digits/amounts are swapped for #1, #2… and looked
 *    up against pattern keys (e.g. "#1 members tracked from May #2 onward."),
 *    then the real numbers are substituted back into the translation. This is
 *    how dynamic strings like "21 members tracked…" translate without a dict
 *    entry per possible number.
 */
export function translateBodyAuto(en: string): string | undefined {
  const key = en.replace(/\s+/g, " ").trim();
  const exact = BODY_TRANSLATIONS[key];
  if (exact) return exact;

  if (!/\d/.test(key)) return undefined;
  const nums: string[] = [];
  const patternKey = key.replace(NUM_RE, (m) => {
    nums.push(m);
    return `#${nums.length}`;
  });
  const pattern = BODY_TRANSLATIONS[patternKey];
  if (!pattern) return undefined;
  return pattern.replace(/#(\d+)/g, (_, i) => nums[Number(i) - 1] ?? "");
}
