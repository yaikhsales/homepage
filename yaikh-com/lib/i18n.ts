"use client";

/* Static i18n dictionary. Add keys + translations here — no external service.
 * Falls back to English if a key is missing from the active language. */

export type Lang = "en" | "zh";

export const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    // Sidebar
    "sidebar.company":         "Texlink Technologies",
    "sidebar.tagline":         "Strategic DTV",
    "sidebar.director":        "Director",
    "sidebar.company_full":    "TEXLINK TECHNOLOGIES CO., LTD.",
    "sidebar.industry":        "Apparel, Footwear, Bags, Softgoods",
    "sidebar.industry_sub":    "Manufacturing Intelligence Solutions",
    "sidebar.download_pdf":    "Download as PDF",
    "sidebar.sign_out":        "Sign out",
    "sidebar.language":        "Language",
    "sidebar.menu":            "Menu",
    "sidebar.close":           "Close",

    // Navigation labels (17 sections)
    "nav.executive":           "Executive Summary",
    "nav.problem":             "The Problem",
    "nav.solution":            "The Solution",
    "nav.architecture":        "Product Architecture",
    "nav.modules":             "Agents & Skills",
    "nav.pricing":             "Pricing & Packaging",
    "nav.customers":           "Target Customers",
    "nav.tech":                "Technology Stack",
    "nav.team":                "Team",
    "nav.capital":             "Capital Efficiency",
    "nav.gtm":                 "Go-to-Market Milestones",
    "nav.traction":            "Traction & Pilots",
    "nav.oc_budget":           "OC & Live Budget Update",
    "nav.competition":         "Competitive Landscape",
    "nav.risks":               "Risks & Mitigations",
    "nav.resources":           "Resource Requirements",
    "nav.appendix":            "Appendix",
  },
  zh: {
    // Sidebar
    "sidebar.company":         "德领科技",
    "sidebar.tagline":         "战略数字工业",
    "sidebar.director":        "总监",
    "sidebar.company_full":    "德领科技有限公司",
    "sidebar.industry":        "服装、鞋类、箱包、软商品",
    "sidebar.industry_sub":    "智能制造解决方案",
    "sidebar.download_pdf":    "下载 PDF",
    "sidebar.sign_out":        "退出",
    "sidebar.language":        "语言",
    "sidebar.menu":            "菜单",
    "sidebar.close":           "关闭",

    // Navigation labels (17 sections)
    "nav.executive":           "执行摘要",
    "nav.problem":             "存在问题",
    "nav.solution":            "解决方案",
    "nav.architecture":        "产品架构",
    "nav.modules":             "智能体与技能",
    "nav.pricing":             "定价与套餐",
    "nav.customers":           "目标客户",
    "nav.tech":                "技术架构",
    "nav.team":                "团队",
    "nav.capital":             "资本效率",
    "nav.gtm":                 "市场推广里程碑",
    "nav.traction":            "业务进展与试点",
    "nav.oc_budget":           "运营与实时预算",
    "nav.competition":         "竞争格局",
    "nav.risks":               "风险与应对",
    "nav.resources":           "资源需求",
    "nav.appendix":            "附录",
  },
};

export function translate(lang: Lang, key: string, fallback?: string): string {
  return TRANSLATIONS[lang]?.[key] ?? fallback ?? TRANSLATIONS.en[key] ?? key;
}
