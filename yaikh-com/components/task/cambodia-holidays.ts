/* Cambodia public holidays 2026–2027.
 *
 * Sourced from officeholidays.com; lunar-based dates (Visak Bochea, Royal
 * Plowing Ceremony, Ancestors' Day, Water Festival) are projections and
 * may be adjusted once the government issues the official calendar.
 * Update this list each November for the next year.
 */

export type Holiday = { date: string; name: string };

export const CAMBODIA_HOLIDAYS: Holiday[] = [
  // 2026
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-07", name: "Victory over Genocide" },
  { date: "2026-03-08", name: "International Women's Day" },
  { date: "2026-04-14", name: "Khmer New Year" },
  { date: "2026-04-15", name: "Khmer New Year Holiday" },
  { date: "2026-04-16", name: "Khmer New Year Holiday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-04", name: "Visak Bochea" },
  { date: "2026-05-05", name: "Royal Plowing Ceremony" },
  { date: "2026-05-14", name: "King's Birthday" },
  { date: "2026-06-18", name: "King Mother's Birthday" },
  { date: "2026-09-24", name: "Constitution Day" },
  { date: "2026-10-10", name: "Pchum Ben" },
  { date: "2026-10-11", name: "Pchum Ben Holiday" },
  { date: "2026-10-12", name: "Pchum Ben Holiday" },
  { date: "2026-10-15", name: "Commemoration of King Father" },
  { date: "2026-10-29", name: "King's Coronation Day" },
  { date: "2026-11-09", name: "Independence Day" },
  { date: "2026-11-23", name: "Water Festival" },
  { date: "2026-11-24", name: "Water Festival Holiday" },
  { date: "2026-11-25", name: "Water Festival Holiday" },
  { date: "2026-12-29", name: "Peace Day" },

  // 2027
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-07", name: "Victory over Genocide" },
  { date: "2027-03-08", name: "International Women's Day" },
  { date: "2027-04-14", name: "Khmer New Year" },
  { date: "2027-04-15", name: "Khmer New Year Holiday" },
  { date: "2027-04-16", name: "Khmer New Year Holiday" },
  { date: "2027-05-01", name: "Labour Day" },
  { date: "2027-05-14", name: "King's Birthday" },
  { date: "2027-05-20", name: "Visak Bochea" },
  { date: "2027-05-24", name: "Royal Plowing Ceremony" },
  { date: "2027-06-18", name: "King Mother's Birthday" },
  { date: "2027-09-24", name: "Constitution Day" },
  { date: "2027-09-29", name: "Pchum Ben" },
  { date: "2027-09-30", name: "Pchum Ben Holiday" },
  { date: "2027-10-01", name: "Pchum Ben Holiday" },
  { date: "2027-10-15", name: "Commemoration of King Father" },
  { date: "2027-10-29", name: "King's Coronation Day" },
  { date: "2027-11-09", name: "Independence Day" },
  { date: "2027-11-12", name: "Water Festival" },
  { date: "2027-11-13", name: "Water Festival Holiday" },
  { date: "2027-11-14", name: "Water Festival Holiday" },
  { date: "2027-12-29", name: "Peace Day" },
];

export const HOLIDAY_BY_ISO: Map<string, string> = new Map(
  CAMBODIA_HOLIDAYS.map((h) => [h.date, h.name])
);
