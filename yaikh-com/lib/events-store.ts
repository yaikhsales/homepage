// Server-only: event-album store (Minister visits, partnerships, conferences, etc.).
// Each entry = a single event with title, date, narrative, and photos (paths or URLs).

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "events.json");

export type EventAlbum = {
  id: string;                  // stable ID, e.g. "2026-06-min-env-presentation"
  date: string;                // ISO "YYYY-MM-DD"
  title: string;               // e.g. "Minister of Environment presentation"
  description: string;         // narrative — what happened, outcomes
  category?: string;           // "Government" | "Partnership" | "Conference" | "Demo" | ...
  photos: string[];            // URLs or absolute paths to images
  pinned?: boolean;            // float to top
};

export type EventsStore = {
  updatedAt: string | null;
  updatedBy: string | null;
  albums: EventAlbum[];
};

export const SEED_EVENTS_STORE: EventsStore = {
  updatedAt: null,
  updatedBy: null,
  albums: [
    {
      id: "sample-anthropic-cpn-2026-06",
      date: "2026-06-04",
      title: "Anthropic CPN Services Program Webinar",
      description:
        "Attended the Claude Partner Network kickoff webinar (Jun 3 PT / Jun 4 SGT). 7-stage pathway briefed — application → review → team certification → CCAF → portal + tier → case study. Yai team enrolled 10 members in the Anthropic Academy.",
      category: "Partnership",
      photos: [],
      pinned: true,
    },
    {
      id: "sample-cambodia-sti-day",
      date: "2026-05-15",
      title: "Cambodia National STI Day · Phnom Penh",
      description:
        "Yai presented at the National Science, Technology & Innovation Day. Met with Ministry of Industry, Science & Innovation officials. Discussed digital factory transformation pilot.",
      category: "Government",
      photos: [],
    },
    {
      id: "sample-singapore-ai-week",
      date: "2026-04-22",
      title: "Singapore Ai Week Attendance",
      description:
        "Three-day attendance at Singapore Ai Week. Met partners from Google Cloud APAC, attended JICA digital-economy session, scoped ASEAN expansion roadmap.",
      category: "Conference",
      photos: [],
    },
  ],
};

export async function readEventsStore(): Promise<EventsStore> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as EventsStore;
    return {
      updatedAt: parsed.updatedAt ?? null,
      updatedBy: parsed.updatedBy ?? null,
      albums: parsed.albums ?? SEED_EVENTS_STORE.albums,
    };
  } catch {
    return { ...SEED_EVENTS_STORE };
  }
}

export async function writeEventsStore(store: EventsStore): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}
