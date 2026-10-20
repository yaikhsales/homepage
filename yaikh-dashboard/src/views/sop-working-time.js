// Order date anchors Day 0; factory dates use Asia/Phnom_Penh. Shift clock times remain relative.
export const SHIFT_BLOCKS = [
  { key: "morning", label: "Morning · 4h", hours: 4, work: true, color: "#164e63" },
  { key: "lunch", label: "Lunch · 1h", hours: 1, work: false, color: "#713f12" },
  { key: "afternoon", label: "Afternoon · 4h", hours: 4, work: true, color: "#1e3a5f" },
  { key: "ot", label: "OT · 2h", hours: 2, work: true, color: "#4c1d95" },
];
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function factoryToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Phnom_Penh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = type => parts.find(part => part.type === type).value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
export function buildWorkingAxis(workdayCount, pixelsPerHour = 32, orderDate = factoryToday()) {
  const origin = new Date(`${orderDate}T12:00:00Z`);
  if (!Number.isFinite(origin.getTime())) throw new Error("Invalid order date");
  const initialWeekday = (origin.getUTCDay() + 6) % 7;
  const days = [], working = [];
  let x = 0, calendarDay = 0;
  while (working.length < Math.ceil(workdayCount)) {
    const weekday = (initialWeekday + calendarDay) % 7;
    const current = new Date(origin); current.setUTCDate(origin.getUTCDate() + calendarDay);
    const date = current.toISOString().slice(0,10);
    const dateLabel = new Intl.DateTimeFormat("en-GB", {day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(current);
    const off = weekday === 6;
    const blocks = off ? [] : SHIFT_BLOCKS.filter(block => weekday !== 5 || block.key !== "ot");
    let offset = 0;
    const segments = blocks.map(block => { const segment = { ...block, x: x + offset, width: block.hours * pixelsPerHour }; offset += segment.width; return segment; });
    const width = off ? pixelsPerHour * 2 : offset;
    const day = { x, width, date, dateLabel, calendarDay, weekday: WEEK[weekday], off, workday: off ? null : working.length, segments };
    days.push(day); if (!off) working.push(day);
    x += width; calendarDay += 1;
  }
  const at = value => {
    if (value <= 0) return 0;
    if (value >= working.length) return x;
    const index = Math.floor(value), fraction = value - index, day = working[index];
    let hours = fraction * (day.weekday === "Sat" ? 8 : 10);
    // Partial-day work offsets skip the lunch break.
    if (hours > 4) hours += 1;
    return day.x + hours * pixelsPerHour;
  };
  return { days, at, width: x, pixelsPerHour, orderDate };
}
