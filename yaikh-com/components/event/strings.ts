/* Words on the public event page, in the three languages its flags offer.
 * The event's own title is shown as entered — only the page's wording
 * changes. */

export type EvLang = "km" | "en" | "zh";
export const EV_LANGS: EvLang[] = ["km", "en", "zh"];

const S = {
  register: { en: "Register", km: "ចុះឈ្មោះ", zh: "报名" },
  name: { en: "Name", km: "ឈ្មោះ", zh: "姓名" },
  consent: {
    en: "Confirm — we may contact you by",
    km: "បញ្ជាក់ — យើងអាចទាក់ទងអ្នកតាម",
    zh: "确认 — 我们可以通过以下方式联系您",
  },
  email: { en: "Email", km: "អ៊ីមែល", zh: "电子邮件" },
  phone: { en: "Phone", km: "ទូរស័ព្ទ", zh: "电话" },
  telegram: { en: "Telegram", km: "តេឡេក្រាម", zh: "Telegram" },
  emailPh: { en: "Email", km: "អ៊ីមែល", zh: "电子邮件" },
  phonePh: { en: "Phone number", km: "លេខទូរស័ព្ទ", zh: "电话号码" },
  telegramPh: { en: "Telegram @username", km: "តេឡេក្រាម @username", zh: "Telegram @用户名" },
  submit: { en: "Submit", km: "ដាក់ស្នើ", zh: "提交" },
  submitting: { en: "Submitting…", km: "កំពុងដាក់ស្នើ…", zh: "提交中…" },
  tickOne: {
    en: "Tick at least one way we may contact you.",
    km: "សូមជ្រើសរើសយ៉ាងហោចណាស់មធ្យោបាយមួយ ដើម្បីទាក់ទងអ្នក។",
    zh: "请至少勾选一种联系方式。",
  },
  network: {
    en: "Network error. Please try again.",
    km: "បញ្ហាបណ្ដាញ។ សូមព្យាយាមម្ដងទៀត។",
    zh: "网络错误，请重试。",
  },
  failed: {
    en: "Could not register just now. Please try again.",
    km: "មិនអាចចុះឈ្មោះបានទេឥឡូវនេះ។ សូមព្យាយាមម្ដងទៀត។",
    zh: "暂时无法报名，请重试。",
  },
  doneTitle: { en: "You are registered.", km: "អ្នកបានចុះឈ្មោះរួចរាល់។", zh: "报名成功。" },
  doneBody: { en: "We will be in touch.", km: "យើងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។", zh: "我们会尽快与您联系。" },
  home: { en: "Back to home", km: "ត្រឡប់ទៅទំព័រដើម", zh: "返回首页" },
  map: { en: "map ↗", km: "ផែនទី ↗", zh: "地图 ↗" },
  attend: { en: "I will attend — pick one day", km: "ខ្ញុំនឹងចូលរួមថ្ងៃ — ជ្រើសរើសតែមួយថ្ងៃ", zh: "我将参加 — 只选一天" },
  tickDay: {
    en: "Tick the day you will attend.",
    km: "សូមជ្រើសរើសថ្ងៃដែលអ្នកនឹងចូលរួម។",
    zh: "请勾选您参加的日期。",
  },
  handouts: { en: "Handout", km: "ឯកសារចែកជូន", zh: "宣传单" },
  slides: { en: "Slides", km: "ស្លាយ", zh: "演示文稿" },
  slidesSoon: { en: "Slides open on", km: "ស្លាយបើកនៅ", zh: "演示文稿开放日期" },
  slidesClosed: { en: "Slides are no longer available.", km: "ស្លាយមិនអាចមើលបានទៀតទេ។", zh: "演示文稿已不再提供。" },
  morning: { en: "Coffee & snack", km: "កាហ្វេ និងអាហារសម្រន់", zh: "咖啡和点心" },
  lunch: { en: "Lunch", km: "អាហារថ្ងៃត្រង់", zh: "午餐" },
  afternoon: { en: "Afternoon tea", km: "តែពេលរសៀល", zh: "下午茶" },
} as const;

export type EvKey = keyof typeof S;
export function evT(lang: EvLang, key: EvKey): string {
  return S[key][lang];
}

const WD = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  km: ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"],
  zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
};
const MON = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  km: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
};

function parts(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return { w: d.getDay(), day: d.getDate(), m: d.getMonth(), y: d.getFullYear() };
}

/** The event's dates in the chosen language. */
export function evDateRange(lang: EvLang, date: string, endDate?: string): string {
  const a = parts(date);
  if (!a) return date;
  const b = endDate && endDate > date ? parts(endDate) : null;

  if (lang === "zh") {
    const one = (p: NonNullable<typeof a>, withYear: boolean) =>
      `${withYear ? `${p.y}年` : ""}${p.m + 1}月${p.day}日（${WD.zh[p.w]}）`;
    if (!b) return one(a, true);
    return `${one(a, true)} – ${one(b, b.y !== a.y)}`;
  }

  const wd = WD[lang], mon = MON[lang];
  const one = (p: NonNullable<typeof a>) => `${wd[p.w]} ${p.day} ${mon[p.m]} ${p.y}`;
  if (!b) return one(a);
  if (a.y !== b.y) return `${one(a)} – ${one(b)}`;
  if (a.m !== b.m) return `${wd[a.w]} ${a.day} ${mon[a.m]} – ${one(b)}`;
  return `${wd[a.w]} ${a.day} – ${one(b)}`;
}

const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** One day, short: "Fri 18 Dec 26" · "សុក្រ 18 ធ្នូ 26" · "12月18日（周五）". */
export function evDayShort(lang: EvLang, iso: string): string {
  const p = parts(iso);
  if (!p) return iso;
  const yy = String(p.y).slice(2);
  if (lang === "zh") return `${p.m + 1}月${p.day}日（${WD.zh[p.w]}）`;
  if (lang === "km") return `${WD.km[p.w]} ${p.day} ${MON.km[p.m]} ${yy}`;
  return `${WD.en[p.w]} ${p.day} ${MON_SHORT[p.m]} ${yy}`;
}

/** Every day an event runs, first to last (at most 31). */
export function eventDays(date: string, endDate?: string): string[] {
  const out = [date];
  if (!endDate || endDate <= date) return out;
  const d = new Date(`${date}T00:00:00Z`);
  for (let i = 0; i < 31; i++) {
    d.setUTCDate(d.getUTCDate() + 1);
    const iso = d.toISOString().slice(0, 10);
    if (iso > endDate) break;
    out.push(iso);
  }
  return out;
}
