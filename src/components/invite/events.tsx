"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Invite, InviteEvent } from "@/content/invites/types";
import { Icon } from "@/components/ornaments";
import {
  downloadIcs,
  formatDay,
  formatDayNum,
  formatMonthShort,
  formatTime,
  googleCalendarLink,
  mapsLink,
} from "@/lib/invite-utils";
import { EventArt, THEMES } from "./event-art";
import { SectionHeading } from "./section-heading";

function CalendarMenu({ event, couple, slug, chip }: { event: InviteEvent; couple: string; slug: string; chip: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-[0.65rem] tracking-[0.18em] uppercase ring-1 backdrop-blur transition hover:brightness-110 ${chip}`}
      >
        <Icon name="calendar" /> Save
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            className="absolute bottom-full left-0 z-20 mb-2 w-52 overflow-hidden rounded-xl bg-ivory text-left text-ink shadow-2xl ring-1 ring-gold-300/60"
          >
            <a
              href={googleCalendarLink(event, couple)}
              target="_blank"
              rel="noreferrer"
              className="block px-4 py-3 font-serif text-lg hover:bg-gold-100"
              onClick={() => setOpen(false)}
            >
              Google Calendar
            </a>
            <button
              type="button"
              className="block w-full border-t border-gold-200 px-4 py-3 text-left font-serif text-lg hover:bg-gold-100"
              onClick={() => {
                downloadIcs([event], couple, `${slug}-${event.id}`);
                setOpen(false);
              }}
            >
              Apple / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCard({ event, index, total, invite }: { event: InviteEvent; index: number; total: number; invite: Invite }) {
  const t = THEMES[event.theme];
  const couple = `${invite.partner1.first} & ${invite.partner2.first}`;

  return (
    <div className="sticky" style={{ top: `calc(4.5rem + ${index * 14}px)` }}>
      <motion.article
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative mx-auto mb-10 max-w-3xl overflow-hidden rounded-[2rem] p-6 shadow-[0_40px_80px_-30px_rgba(40,8,14,.55)] sm:p-10 ${t.bg} ${t.ink}`}
        aria-labelledby={`ev-${event.id}`}
      >
        <div className="pointer-events-none absolute inset-2.5 rounded-[1.6rem] ring-1 ring-current/15" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-10">
          <div className="relative flex items-start justify-between md:block">
            <div className="md:hidden">
              <p className={`eyebrow text-[0.6rem] opacity-80`}>
                Function {index + 1} of {total}
              </p>
              <h3 id={`ev-${event.id}`} className={`mt-1 font-script text-[3.2rem] leading-none ${t.accent}`}>
                {event.title}
              </h3>
              <p className="mt-1 font-hindi text-lg opacity-85">{event.hindi}</p>
            </div>
            <EventArt theme={event.theme} className={`w-28 shrink-0 sm:w-36 md:mx-auto md:w-full md:max-w-[240px] ${t.art}`} />
          </div>

          <div>
            <div className="hidden md:block">
              <p className="eyebrow text-[0.6rem] opacity-80">
                Function {index + 1} of {total}
              </p>
              <h3 className={`mt-1 font-script text-6xl leading-none ${t.accent}`}>{event.title}</h3>
              <p className="mt-1 font-hindi text-xl opacity-85">{event.hindi}</p>
            </div>
            <p className="mt-1 font-serif text-xl italic opacity-90 md:mt-3">{event.tagline}</p>

            <div className="mt-6 flex items-stretch gap-4">
              <div className={`flex w-20 flex-col items-center justify-center rounded-2xl py-3 ring-1 ${t.chip}`}>
                <span className="font-display text-3xl leading-none">{formatDayNum(event.start)}</span>
                <span className="eyebrow mt-1 text-[0.6rem]">{formatMonthShort(event.start)}</span>
              </div>
              <div className="flex flex-col justify-center gap-1.5">
                <p className="flex items-center gap-2 font-display text-sm tracking-[0.15em] uppercase">
                  <Icon name="calendar" className="size-4 opacity-70" /> {formatDay(event.start)}
                </p>
                <p className="flex items-center gap-2 font-display text-sm tracking-[0.15em] uppercase">
                  <Icon name="clock" className="size-4 opacity-70" /> {formatTime(event.start)} onwards
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <Icon name="pin" className="mt-1 size-4 shrink-0 opacity-70" />
              <div>
                <p className="font-serif text-xl font-semibold">{event.venue}</p>
                <p className="font-serif text-base opacity-80">{event.address}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Icon name="shirt" className="size-4 shrink-0 opacity-70" />
              <p className="font-serif text-base opacity-90">{event.dressCode.label}</p>
              <div className="ml-auto flex -space-x-1.5">
                {event.dressCode.colors.map((c) => (
                  <span key={c} className="size-5 rounded-full ring-2 ring-white/70" style={{ background: c }} />
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <CalendarMenu event={event} couple={couple} slug={invite.slug} chip={t.chip} />
              <a
                href={mapsLink(event.mapQuery)}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-[0.65rem] tracking-[0.18em] uppercase ring-1 backdrop-blur transition hover:brightness-110 ${t.chip}`}
              >
                <Icon name="pin" /> Directions
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Events({ invite }: { invite: Invite }) {
  return (
    <section id="events" className="relative bg-paper pt-24 pb-14">
      <SectionHeading eyebrow="Join us for" title="Wedding Events" hindi="शुभ कार्यक्रम" />
      <div className="mt-12 px-4">
        {invite.events.map((e, i) => (
          <EventCard key={e.id} event={e} index={i} total={invite.events.length} invite={invite} />
        ))}
      </div>
    </section>
  );
}
