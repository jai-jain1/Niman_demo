"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import type { Invite } from "@/content/invites/types";
import { Icon } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/invite-utils";
import { SectionHeading } from "./section-heading";

type Form = {
  name: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  events: string[];
  meal: string;
  arrival: string;
  message: string;
};

const fieldLabel = "eyebrow text-[0.58rem] text-gold-700";
const input =
  "mt-1 w-full border-0 border-b border-gold-300 bg-transparent px-0 py-2 font-serif text-xl text-ink placeholder:text-ink/35 focus:border-maroon-500 focus:ring-0 focus:outline-none";

function Barcode({ seed }: { seed: string }) {
  const bars: { x: number; w: number }[] = [];
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 46; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bars.push({ x: i * 4.2, w: 1 + (h % 3) });
  }
  return (
    <svg viewBox="0 0 196 40" className="h-10 w-full" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#2a1418" />
      ))}
    </svg>
  );
}

const noopSubscribe = () => () => {};

export function Rsvp({ invite, guest }: { invite: Invite; guest: string | null }) {
  const storeKey = `niman-rsvp-${invite.slug}`;
  const saved = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return localStorage.getItem(storeKey);
      } catch {
        return null;
      }
    },
    () => null,
  );
  let restored: Form | null = null;
  try {
    restored = saved ? (JSON.parse(saved) as Form) : null;
  } catch {}
  const initial: Form = restored ?? {
    name: guest ?? "",
    phone: "",
    attending: "yes",
    guests: 1,
    events: invite.events.map((e) => e.id),
    meal: invite.rsvp.meals[0],
    arrival: "",
    message: "",
  };
  // Remount once the browser-only values (saved RSVP, guest name) are known.
  return <RsvpCard key={`${saved ? "saved" : "new"}-${guest ?? ""}`} invite={invite} storeKey={storeKey} initial={initial} restored={!!restored} />;
}

function RsvpCard({ invite, storeKey, initial, restored }: { invite: Invite; storeKey: string; initial: Form; restored: boolean }) {
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(restored ? "done" : "idle");

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const waText = () =>
    [
      `🙏 RSVP for ${invite.partner1.first} & ${invite.partner2.first}'s wedding`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.attending === "yes"
        ? `Attending: Joyfully yes · ${form.guests} guest${form.guests > 1 ? "s" : ""}`
        : "Attending: Regretfully no",
      form.attending === "yes" ? `Functions: ${invite.events.filter((e) => form.events.includes(e.id)).map((e) => e.title).join(", ")}` : "",
      form.attending === "yes" ? `Meal: ${form.meal}` : "",
      form.arrival ? `Arrival: ${form.arrival}` : "",
      form.message ? `Blessings: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 2) errs.name = "Please share your name";
    if (!/^(\+?\d[\d\s-]{8,14}\d)$/.test(form.phone.trim())) errs.phone = "Please enter a valid phone number";
    if (form.attending === "yes" && form.events.length === 0) errs.events = "Pick at least one function";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: invite.slug, ...form }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(storeKey, JSON.stringify(form));
      } catch {}
      setStatus("done");
      if (form.attending === "yes") {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.65 }, colors: ["#c49a45", "#e9cf87", "#8c1c2e", "#f28c07", "#fff1c7"] });
      }
    } catch {
      setStatus("error");
    }
  };

  const route = (
    <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
      <div>
        <p className="font-display text-4xl text-maroon-600">{invite.from.code}</p>
        <p className="font-serif text-sm text-ink/70">
          {invite.from.city}, {invite.from.state}
        </p>
        <p className="eyebrow mt-1 text-[0.55rem] text-gold-700">{invite.from.date}</p>
      </div>
      <div className="flex flex-1 items-center px-3 text-gold-500">
        <span className="h-px flex-1 border-t border-dashed border-gold-400" />
        <Icon name="plane" className="mx-2 size-5 rotate-45 text-gold-600" />
        <span className="h-px flex-1 border-t border-dashed border-gold-400" />
      </div>
      <div className="text-right">
        <p className="font-display text-4xl text-maroon-600">{invite.to.code}</p>
        <p className="font-serif text-sm text-ink/70">
          {invite.to.city}, {invite.to.state}
        </p>
        <p className="eyebrow mt-1 text-[0.55rem] text-gold-700">{invite.to.date}</p>
      </div>
    </div>
  );

  return (
    <section id="rsvp" className="relative bg-paper py-24">
      <SectionHeading eyebrow={`Kindly respond by ${formatDate(invite.rsvp.deadline)}`} title="Kindly Respond" />
      <Reveal className="mx-auto mt-4 max-w-md px-6 text-center font-serif text-xl text-ink/70 italic">
        Your seat on our journey is waiting — fill in your boarding pass.
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-xl px-4">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ivory shadow-[0_40px_80px_-30px_rgba(95,15,30,.45)] ring-1 ring-gold-300/60">
          <div className="flex items-center justify-between bg-gradient-to-r from-maroon-700 via-maroon-600 to-maroon-700 px-6 py-3.5 text-gold-100 sm:px-8">
            <span className="flex items-center gap-2 eyebrow text-[0.55rem] tracking-[0.2em] sm:text-[0.6rem] sm:tracking-[0.32em]">
              <Icon name="plane" className="size-4" /> The Wedding Express
            </span>
            <span className="eyebrow text-[0.55rem] tracking-[0.2em] opacity-80 sm:text-[0.6rem] sm:tracking-[0.32em]">Boarding Pass</span>
          </div>
          {route}

          <div className="relative my-6 h-6">
            <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-paper ring-1 ring-gold-300/60" />
            <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-paper ring-1 ring-gold-300/60" />
            <span className="absolute top-1/2 right-5 left-5 border-t-2 border-dashed border-gold-300" />
          </div>

          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-8 sm:px-8">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="col-span-2">
                    <p className={fieldLabel}>Passenger</p>
                    <p className="font-serif text-2xl font-semibold text-ink">{form.name}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Status</p>
                    <p className={`font-display text-lg ${form.attending === "yes" ? "text-henna" : "text-maroon-500"}`}>
                      {form.attending === "yes" ? "CONFIRMED" : "WILL MISS YOU"}
                    </p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Seats</p>
                    <p className="font-display text-lg text-ink">{form.attending === "yes" ? form.guests : "—"}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Gate</p>
                    <p className="font-display text-lg text-ink">LOVE</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Class</p>
                    <p className="font-display text-lg text-ink">FAMILY</p>
                  </div>
                </div>
                <p className="mt-6 text-center font-script text-3xl text-maroon-600">
                  {form.attending === "yes" ? "We can't wait to celebrate with you!" : "You will be missed — thank you for your blessings."}
                </p>
                <div className="mt-6">
                  <Barcode seed={form.name + form.phone} />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://wa.me/${invite.rsvp.whatsapp}?text=${encodeURIComponent(waText())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f8f4e] px-5 py-3 font-display text-[0.65rem] tracking-[0.18em] text-white uppercase shadow-md"
                  >
                    <Icon name="whatsapp" /> Also send on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-[0.65rem] tracking-[0.18em] text-maroon-600 uppercase ring-1 ring-maroon-500/30"
                  >
                    Edit response
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-6 px-6 pb-8 sm:px-8">
                <label className="block">
                  <span className={fieldLabel}>Your name</span>
                  <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" autoComplete="name" />
                  {errors.name && <span className="mt-1 block text-sm text-maroon-500">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className={fieldLabel}>Phone number</span>
                  <input
                    className={input}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {errors.phone && <span className="mt-1 block text-sm text-maroon-500">{errors.phone}</span>}
                </label>

                <fieldset>
                  <legend className={fieldLabel}>Will you attend?</legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => set("attending", v)}
                        aria-pressed={form.attending === v}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 font-serif text-lg transition ${
                          form.attending === v ? "bg-maroon-600 text-gold-100 shadow-md" : "bg-white text-ink/80 ring-1 ring-gold-300"
                        }`}
                      >
                        {v === "yes" ? "Joyfully yes" : "Regretfully no"}
                        {form.attending === v && <Icon name="check" />}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {form.attending === "yes" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <p className={fieldLabel}>Number of guests</p>
                        <div className="mt-2 flex items-center gap-5">
                          <button
                            type="button"
                            aria-label="Fewer guests"
                            onClick={() => set("guests", Math.max(1, form.guests - 1))}
                            className="grid size-11 place-items-center rounded-full font-serif text-2xl text-maroon-600 ring-1 ring-gold-400"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-display text-2xl tabular-nums">{form.guests}</span>
                          <button
                            type="button"
                            aria-label="More guests"
                            onClick={() => set("guests", Math.min(12, form.guests + 1))}
                            className="grid size-11 place-items-center rounded-full font-serif text-2xl text-maroon-600 ring-1 ring-gold-400"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <fieldset>
                        <legend className={fieldLabel}>Functions you will attend</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {invite.events.map((ev) => {
                            const on = form.events.includes(ev.id);
                            return (
                              <button
                                type="button"
                                key={ev.id}
                                aria-pressed={on}
                                onClick={() => set("events", on ? form.events.filter((x) => x !== ev.id) : [...form.events, ev.id])}
                                className={`rounded-full px-4 py-2 font-serif text-base transition ${
                                  on ? "bg-gold-500 text-white shadow" : "bg-white text-ink/70 ring-1 ring-gold-300"
                                }`}
                              >
                                {ev.title}
                              </button>
                            );
                          })}
                        </div>
                        {errors.events && <span className="mt-1 block text-sm text-maroon-500">{errors.events}</span>}
                      </fieldset>

                      <fieldset>
                        <legend className={fieldLabel}>Meal preference</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {invite.rsvp.meals.map((m) => (
                            <button
                              type="button"
                              key={m}
                              aria-pressed={form.meal === m}
                              onClick={() => set("meal", m)}
                              className={`rounded-full px-4 py-2 font-serif text-base transition ${
                                form.meal === m ? "bg-henna text-white shadow" : "bg-white text-ink/70 ring-1 ring-gold-300"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      <label className="block">
                        <span className={fieldLabel}>Arrival details (optional)</span>
                        <input
                          className={input}
                          value={form.arrival}
                          onChange={(e) => set("arrival", e.target.value)}
                          placeholder="e.g. 6E 211, 18 Feb, 11:40 AM"
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="block">
                  <span className={fieldLabel}>A message for the couple</span>
                  <textarea
                    className={`${input} min-h-20 resize-none`}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Your blessings & wishes…"
                    rows={2}
                  />
                </label>

                {status === "error" && (
                  <p className="rounded-xl bg-maroon-50 px-4 py-3 font-serif text-base text-maroon-600">
                    We couldn&apos;t send that just now.{" "}
                    <a className="underline" href={`https://wa.me/${invite.rsvp.whatsapp}?text=${encodeURIComponent(waText())}`} target="_blank" rel="noreferrer">
                      Send your RSVP on WhatsApp instead
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="relative w-full overflow-hidden rounded-full bg-maroon-600 py-4 font-display text-sm tracking-[0.25em] text-gold-100 uppercase shadow-lg shadow-maroon-900/25 transition hover:bg-maroon-700 disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 hover:translate-x-full" />
                  {status === "sending" ? "Boarding…" : "Confirm my seat"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
