import { getInvite } from "@/content/invites";

type Rsvp = {
  slug: string;
  name: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  events: string[];
  meal: string;
  arrival?: string;
  message?: string;
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Receives RSVPs from invitation pages. When RSVP_WEBHOOK_URL is set (e.g. a
 * Google Apps Script web app — see README), each response is appended to the
 * couple's Google Sheet.
 */
export async function POST(request: Request) {
  let body: Partial<Rsvp>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const invite = getInvite(clean(body.slug, 80));
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  if (!invite) return Response.json({ ok: false, error: "Unknown invitation" }, { status: 404 });
  if (name.length < 2 || !/^\+?[\d\s-]{10,16}$/.test(phone)) {
    return Response.json({ ok: false, error: "Name and a valid phone number are required" }, { status: 422 });
  }

  const validEvents = new Set(invite.events.map((e) => e.id));
  const record = {
    receivedAt: new Date().toISOString(),
    invite: invite.slug,
    name,
    phone,
    attending: body.attending === "no" ? "no" : "yes",
    guests: Math.min(Math.max(Number(body.guests) || 1, 1), 12),
    events: (Array.isArray(body.events) ? body.events : []).filter((e) => validEvents.has(e)).join(", "),
    meal: invite.rsvp.meals.includes(clean(body.meal)) ? clean(body.meal) : "",
    arrival: clean(body.arrival),
    message: clean(body.message, 1000),
  };

  const webhook = process.env.RSVP_WEBHOOK_URL;
  let delivered = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      delivered = res.ok;
    } catch (err) {
      console.error("[rsvp] webhook failed", err);
    }
    if (!delivered) return Response.json({ ok: false, error: "Could not record RSVP" }, { status: 502 });
  } else {
    console.info("[rsvp] RSVP_WEBHOOK_URL not set — logging only", record);
  }

  return Response.json({ ok: true, delivered });
}
