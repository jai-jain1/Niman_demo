"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { Invite } from "@/content/invites/types";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "./section-heading";
import { StoryScene } from "./story-scenes";

export function Story({ invite }: { invite: Invite }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section id="story" className="paper-grain relative bg-ivory py-24">
      <SectionHeading eyebrow="How it all began" title="Our Story" />
      <Reveal className="mx-auto mt-6 max-w-lg px-6 text-center font-serif text-xl leading-relaxed text-ink/75 italic">
        {invite.story.intro}
      </Reveal>

      <div ref={ref} className="relative mx-auto mt-16 max-w-4xl px-5">
        <div className="absolute top-0 bottom-0 left-[1.6rem] w-px bg-gold-300/40 md:left-1/2" />
        <motion.div
          className="absolute top-0 bottom-0 left-[1.6rem] w-px origin-top bg-gradient-to-b from-gold-400 via-maroon-400 to-gold-500 md:left-1/2"
          style={{ scaleY: line }}
        />

        <ol className="space-y-16 md:space-y-24">
          {invite.story.chapters.map((c, i) => {
            const right = i % 2 === 1;
            return (
              <li key={c.year} className="relative grid items-center gap-6 pl-12 md:grid-cols-2 md:gap-14 md:pl-0">
                <span className="absolute top-2 left-[1.6rem] z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full bg-ivory ring-2 ring-gold-500 md:top-1/2 md:left-1/2 md:-translate-y-1/2">
                  <span className="size-1.5 rounded-full bg-maroon-500" />
                </span>

                <motion.figure
                  initial={{ opacity: 0, rotate: right ? 6 : -6, y: 40 }}
                  whileInView={{ opacity: 1, rotate: right ? 2 : -2, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative rounded-md bg-white p-2.5 pb-10 shadow-[0_24px_50px_-20px_rgba(60,20,10,.45)] ${right ? "md:order-2" : ""}`}
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-sm">
                    {c.photo ? (
                      <Image src={c.photo} alt={c.title} fill sizes="(min-width: 768px) 420px, 90vw" className="object-cover" />
                    ) : (
                      <StoryScene scene={c.scene} className="h-full w-full" />
                    )}
                  </div>
                  <figcaption className="absolute right-0 bottom-2 left-0 text-center font-script text-2xl text-maroon-600">{c.year}</figcaption>
                  <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-gold-100/80 shadow-sm" />
                </motion.figure>

                <Reveal className={right ? "md:order-1 md:text-right" : ""}>
                  <p className="eyebrow text-gold-600">Chapter {i + 1}</p>
                  <h3 className="mt-1 font-serif text-3xl leading-tight font-semibold text-maroon-600">{c.title}</h3>
                  <p className="mt-3 font-serif text-lg leading-relaxed text-ink/75">{c.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
