export type EventTheme = "haldi" | "mehndi" | "sangeet" | "wedding" | "reception";

export type Person = { name: string; relation?: string };

export type InviteEvent = {
  id: string;
  theme: EventTheme;
  title: string;
  /** Devanagari title shown beside the English one. */
  hindi: string;
  tagline: string;
  /** ISO local date-time of the event, e.g. "2027-02-12T12:00:00+05:30". */
  start: string;
  /** ISO end time — used for calendar entries. */
  end: string;
  venue: string;
  address: string;
  mapQuery: string;
  dressCode: { label: string; colors: string[] };
};

export type StoryChapter = {
  year: string;
  title: string;
  text: string;
  /** Optional photo in /public. When absent, an illustrated scene is drawn. */
  photo?: string;
  scene: "city" | "mountains" | "beach" | "lake" | "palace";
};

export type Invite = {
  slug: string;
  partner1: { first: string; full: string; parents: string; relation: "Son" | "Daughter" };
  partner2: { first: string; full: string; parents: string; relation: "Son" | "Daughter" };
  /** Primary wedding moment — drives the countdown and scratch reveal. */
  weddingDate: string;
  hashtag: string;
  shloka: string[];
  invitationLine: string;
  from: { city: string; code: string; state: string; date: string };
  to: { city: string; code: string; state: string; date: string };
  story: { intro: string; chapters: StoryChapter[] };
  events: InviteEvent[];
  venue: {
    name: string;
    city: string;
    address: string;
    mapQuery: string;
    notes: string[];
  };
  blessings: { title: string; people: string[] }[];
  /** “Darshanabhilashi” — the little ones who await you. */
  littleOnes: { names: string[]; line: string; lineHindi: string };
  travel: { title: string; text: string; icon: "plane" | "train" | "hotel" | "car" }[];
  faqs: { q: string; a: string }[];
  rsvp: {
    deadline: string;
    /** Couple's WhatsApp, digits with country code. */
    whatsapp: string;
    meals: string[];
  };
  thankYou: string;
  /**
   * Songs in /public. `entry` is a short 50–60 s clip that plays as the gates
   * open, then crossfades into the looping `background` track. Missing files
   * fall back to a gentle synthesised tanpura.
   */
  music?: { entry?: SongClip; background?: SongClip };
};

export type SongClip = {
  src: string;
  /** Shown in the "now playing" tag, e.g. "Din Shagna Da". */
  title?: string;
  /** Seconds into the track to start from — jump straight to the hook. */
  start?: number;
  /** Seconds to play before fading out (entry clips). */
  duration?: number;
  volume?: number;
};
