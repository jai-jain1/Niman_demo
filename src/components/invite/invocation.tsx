import type { Invite } from "@/content/invites/types";
import { CornerFlourish, LotusDivider, Mandala, Toran } from "@/components/ornaments";
import { Reveal, WordReveal } from "@/components/reveal";

export function Invocation({ invite }: { invite: Invite }) {
  const { partner1: a, partner2: b } = invite;
  return (
    <section id="invitation" className="paper-grain relative overflow-hidden bg-ivory pt-0 pb-24">
      <div className="h-[3px] bg-foil" />
      <Toran className="h-24 w-full sm:h-32" />

      <Mandala className="pointer-events-none absolute top-40 left-1/2 w-[46rem] max-w-none -translate-x-1/2 text-gold-400/15 animate-spin-slow [animation-duration:120s]" />

      <div className="relative mx-auto mt-4 max-w-xl px-5">
        <Reveal className="relative rounded-[2rem] bg-paper/80 px-6 py-12 text-center shadow-[0_30px_80px_-30px_rgba(95,15,30,.35)] ring-1 ring-gold-300/50 backdrop-blur-sm sm:px-12">
          <div className="pointer-events-none absolute inset-3 rounded-[1.6rem] ring-1 ring-gold-400/40" />
          <CornerFlourish className="absolute top-4 left-4 w-14 text-gold-500/70" />
          <CornerFlourish className="absolute top-4 right-4 w-14 -scale-x-100 text-gold-500/70" />
          <CornerFlourish className="absolute bottom-4 left-4 w-14 -scale-y-100 text-gold-500/70" />
          <CornerFlourish className="absolute right-4 bottom-4 w-14 -scale-100 text-gold-500/70" />

          <p className="text-foil-deep font-hindi text-6xl leading-none">ॐ</p>
          <p className="mt-2 eyebrow text-[0.6rem] text-gold-700">Shri Ganeshaya Namah</p>
          <div className="mt-5 space-y-1 font-hindi text-[1.05rem] text-maroon-700">
            {invite.shloka.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>

          <LotusDivider className="mx-auto my-6 w-48 text-gold-500" />

          <h2 className="font-script text-[clamp(2.6rem,9vw,3.6rem)] leading-tight text-maroon-600">
            <WordReveal text="We Cordially Invite You" />
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-xl leading-relaxed text-ink/80">{invite.invitationLine}</p>

          <div className="mt-10">
            <p className="text-foil-deep font-script text-[clamp(3.4rem,13vw,4.8rem)] leading-none">{a.first}</p>
            <p className="mt-2 font-serif text-lg text-ink/70 italic">{a.relation} of</p>
            <p className="eyebrow mt-1 text-[0.68rem] leading-relaxed text-maroon-600">{a.parents}</p>
          </div>

          <div className="my-7 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500" />
            <span className="font-display text-sm tracking-[0.5em] text-gold-600">WITH</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500" />
          </div>

          <div>
            <p className="text-foil-deep font-script text-[clamp(3.4rem,13vw,4.8rem)] leading-none">{b.first}</p>
            <p className="mt-2 font-serif text-lg text-ink/70 italic">{b.relation} of</p>
            <p className="eyebrow mt-1 text-[0.68rem] leading-relaxed text-maroon-600">{b.parents}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
