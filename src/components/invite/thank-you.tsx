import Link from "next/link";
import type { Invite } from "@/content/invites/types";
import { WaxSeal } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { formatDayNum, formatYear } from "@/lib/invite-utils";
import { CocoaSeal, useInviteTheme } from "./linen";

export function ThankYou({ invite }: { invite: Invite }) {
  const pearl = useInviteTheme() === "pearl";
  const d = invite.weddingDate;
  const month = new Intl.DateTimeFormat("en-IN", { month: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(d));
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-paper to-maroon-700 pt-24 pb-36">
      <Reveal className="mx-auto max-w-lg px-4">
        <div
          className="relative rotate-[-1.5deg] p-3 shadow-[0_40px_80px_-30px_rgba(30,0,6,.7)]"
          style={{
            background: pearl
              ? "repeating-linear-gradient(135deg,#7a5642 0 14px,#fbf6ee 14px 22px,#c6ab86 22px 36px,#fbf6ee 36px 44px)"
              : "repeating-linear-gradient(135deg,#c0182f 0 14px,#fbf6ee 14px 22px,#d4ab5a 22px 36px,#fbf6ee 36px 44px)",
          }}
        >
          <div className="paper-grain relative bg-ivory px-6 py-10 sm:px-10">
            <h2 className="font-script text-[clamp(3.2rem,12vw,4.5rem)] leading-none text-maroon-600">Thank You</h2>
            <p className="mt-4 font-serif text-xl leading-relaxed text-ink/80">{invite.thankYou}</p>
            <p className="mt-6 font-serif text-lg text-ink/60 italic">With love,</p>
            <p className="font-script text-4xl text-maroon-600">
              {invite.partner1.first} & {invite.partner2.first}
            </p>

            <div className="mt-6 flex items-center gap-5 border-t border-gold-300/60 pt-6">
              <div className="grid size-24 shrink-0 rotate-[-12deg] place-items-center rounded-full border-2 border-maroon-500/50 text-center text-maroon-500/80">
                <div>
                  <p className="eyebrow text-[0.5rem]">{invite.to.city}</p>
                  <p className="font-display text-sm">
                    {formatDayNum(d)} · {month} · {formatYear(d).slice(2)}
                  </p>
                  <p className="eyebrow text-[0.5rem]">India</p>
                </div>
              </div>
              <div className="grid size-24 shrink-0 rotate-3 place-items-center border-[5px] border-dotted border-paper bg-white p-1.5 shadow-md outline outline-1 outline-gold-300/70">
                {pearl ? <CocoaSeal className="size-full" /> : <WaxSeal a={invite.partner1.first[0]} b={invite.partner2.first[0]} className="size-full" />}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="eyebrow text-[0.55rem] text-gold-700">To</p>
              {["Our dear family", "& friends,", "with all our love"].map((l) => (
                <p key={l} className="border-b border-gold-300/60 pb-1 font-script text-3xl text-maroon-600">
                  {l}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 text-center text-gold-100">
        <p className="font-script text-4xl">{invite.hashtag}</p>
        <p className="mt-6 font-serif text-sm text-gold-100/70 italic">
          A little piece of forever, crafted by{" "}
          <Link href="/" className="font-display text-xs tracking-[0.2em] text-gold-200 not-italic underline-offset-4 hover:underline">
            NIMAN
          </Link>
        </p>
      </div>
    </section>
  );
}
