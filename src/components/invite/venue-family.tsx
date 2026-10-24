"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Invite } from "@/content/invites/types";
import { Icon, LotusDivider, Mandala } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { mapsEmbed, mapsLink } from "@/lib/invite-utils";
import { SectionHeading } from "./section-heading";

export function Venue({ invite }: { invite: Invite }) {
  const v = invite.venue;
  const [loadMap, setLoadMap] = useState(false);
  return (
    <section id="venue" className="relative bg-paper pb-24">
      <SectionHeading eyebrow="Where the magic happens" title="The Venue" />
      <div className="mx-auto mt-10 grid max-w-5xl gap-8 px-5 md:grid-cols-2 md:items-center">
        <Reveal>
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-night-700 shadow-[0_30px_60px_-25px_rgba(19,35,79,.6)] ring-1 ring-gold-300/60 sm:aspect-square md:aspect-[4/5]"
            onViewportEnter={() => setLoadMap(true)}
            viewport={{ once: true, margin: "200px" }}
          >
            {loadMap ? (
              <iframe
                title={`Map of ${v.name}`}
                src={mapsEmbed(v.mapQuery)}
                className="absolute inset-0 h-full w-full border-0 [filter:sepia(.25)_saturate(.9)_hue-rotate(-8deg)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="grid h-full place-items-center text-gold-200">Loading map…</div>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[2rem] ring-[6px] ring-ivory/70 ring-inset" />
          </motion.div>
        </Reveal>
        <Reveal delay={0.1} className="text-center md:text-left">
          <p className="eyebrow text-gold-600">{v.city}</p>
          <h3 className="mt-2 font-serif text-4xl leading-tight font-semibold text-maroon-600">{v.name}</h3>
          <p className="mt-2 font-serif text-lg text-ink/70">{v.address}</p>
          <ul className="mt-6 space-y-3 text-left">
            {v.notes.map((n) => (
              <li key={n} className="flex gap-3 font-serif text-lg leading-snug text-ink/80">
                <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold-500" />
                {n}
              </li>
            ))}
          </ul>
          <a
            href={mapsLink(v.mapQuery)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-maroon-600 px-6 py-3.5 font-display text-xs tracking-[0.2em] text-gold-100 uppercase shadow-lg shadow-maroon-900/20 transition hover:bg-maroon-700"
          >
            <Icon name="pin" /> Open in Google Maps
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Family({ invite }: { invite: Invite }) {
  const kids = invite.littleOnes;
  return (
    <section id="family" className="relative overflow-hidden bg-ivory py-24">
      <Mandala className="pointer-events-none absolute -top-40 -right-40 w-[30rem] text-gold-400/15 md:animate-spin-slow [animation-duration:150s]" />
      <SectionHeading eyebrow="Awaiting your gracious presence" title="With Blessings From" />
      <div className="relative mx-auto mt-12 grid max-w-4xl gap-5 px-5 sm:grid-cols-2">
        {invite.blessings.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.08} className="rounded-2xl bg-white/70 px-6 py-6 text-center shadow-sm ring-1 ring-gold-300/50">
            <p className="eyebrow text-gold-600">{b.title}</p>
            <div className="mt-3 space-y-1">
              {b.people.map((p) => (
                <p key={p} className="font-serif text-xl leading-snug text-maroon-700">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="relative mx-auto mt-10 max-w-xl px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff3d6] via-[#ffe7ef] to-[#e9f3ff] px-6 py-9 text-center shadow-[0_24px_50px_-24px_rgba(140,28,46,.4)] ring-1 ring-gold-300/60">
          <div className="absolute -top-6 -left-6 size-24 rounded-full bg-marigold/20 blur-2xl" />
          <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-rose/20 blur-2xl" />
          <p className="eyebrow text-gold-700">Darshanabhilashi · दर्शनाभिलाषी</p>
          <p className="mt-4 font-hindi text-2xl leading-relaxed text-maroon-600">“{kids.lineHindi}”</p>
          <p className="mt-1 font-serif text-lg text-ink/70 italic">{kids.line}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {kids.names.map((n, i) => (
              <motion.span
                key={n}
                className="rounded-full bg-white px-4 py-1.5 font-script text-2xl text-maroon-600 shadow-sm ring-1 ring-gold-300/60"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              >
                {n}
              </motion.span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function TravelFaq({ invite }: { invite: Invite }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="travel" className="relative bg-gradient-to-b from-ivory to-paper py-24">
      <SectionHeading eyebrow="Getting there" title="Travel & Stay" />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {invite.travel.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.07} className="group rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-gold-300/50 transition hover:-translate-y-1 hover:shadow-lg">
            <span className="grid size-12 place-items-center rounded-full bg-maroon-600 text-gold-100 shadow-md transition group-hover:scale-110">
              <Icon name={t.icon} className="size-5" />
            </span>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-maroon-600">{t.title}</h3>
            <p className="mt-2 font-serif text-lg leading-snug text-ink/75">{t.text}</p>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-2xl px-5">
        <Reveal className="text-center">
          <p className="eyebrow text-gold-600">Good to know</p>
          <h3 className="mt-2 font-script text-5xl text-maroon-600">Questions & Answers</h3>
          <LotusDivider className="mx-auto mt-2 w-48 text-gold-500" />
        </Reveal>
        <div className="mt-8 divide-y divide-gold-300/50 rounded-2xl bg-white/60 ring-1 ring-gold-300/50">
          {invite.faqs.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-serif text-xl font-semibold text-maroon-700"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {f.q}
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="shrink-0 text-gold-600">
                  <Icon name="chevron" className="size-5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 font-serif text-lg leading-relaxed text-ink/75">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
