import type { InviteEvent } from "@/content/invites/types";

const TZ = "Asia/Kolkata";

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(new Date(iso));

export const formatDay = (iso: string) => fmt(iso, { weekday: "long" });
export const formatDate = (iso: string) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });
export const formatDayNum = (iso: string) => fmt(iso, { day: "2-digit" });
export const formatMonth = (iso: string) => fmt(iso, { month: "long" });
export const formatMonthShort = (iso: string) => fmt(iso, { month: "short" });
export const formatYear = (iso: string) => fmt(iso, { year: "numeric" });
export const formatTime = (iso: string) =>
  fmt(iso, { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?(am|pm)/i, (m) => ` ${m.trim().toUpperCase()}`);

export const mapsLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const mapsEmbed = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;

const toUtcStamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const googleCalendarLink = (e: InviteEvent, couple: string) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title} · ${couple}`,
    dates: `${toUtcStamp(e.start)}/${toUtcStamp(e.end)}`,
    details: `${e.tagline}\nDress code: ${e.dressCode.label}`,
    location: `${e.venue}, ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const icsEscape = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

/** Builds and downloads an .ics file — works with Apple, Outlook and Google calendars. */
export const downloadIcs = (events: InviteEvent[], couple: string, filename: string) => {
  const now = toUtcStamp(new Date().toISOString());
  const body = events
    .map((e) =>
      [
        "BEGIN:VEVENT",
        `UID:${e.id}-${filename}@niman`,
        `DTSTAMP:${now}`,
        `DTSTART:${toUtcStamp(e.start)}`,
        `DTEND:${toUtcStamp(e.end)}`,
        `SUMMARY:${icsEscape(`${e.title} · ${couple}`)}`,
        `DESCRIPTION:${icsEscape(`${e.tagline}\nDress code: ${e.dressCode.label}`)}`,
        `LOCATION:${icsEscape(`${e.venue}, ${e.address}`)}`,
        "BEGIN:VALARM",
        "TRIGGER:-PT3H",
        "ACTION:DISPLAY",
        `DESCRIPTION:${icsEscape(e.title)}`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n"),
    )
    .join("\r\n");
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Niman//Invitation//EN\r\nCALSCALE:GREGORIAN\r\n${body}\r\nEND:VCALENDAR`;
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Deterministic PRNG so decorative randomness is identical on server & client. */
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
