import { LotusDivider } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  hindi,
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  hindi?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      {eyebrow && <p className={`eyebrow ${light ? "text-gold-200" : "text-gold-600"}`}>{eyebrow}</p>}
      <h2
        className={`mt-2 font-script text-[clamp(2.9rem,9vw,4.75rem)] leading-[1.05] ${light ? "text-gold-100" : "text-maroon-600"}`}
      >
        {title}
      </h2>
      {hindi && <p className={`mt-1 font-hindi text-lg ${light ? "text-gold-200/80" : "text-gold-700/80"}`}>{hindi}</p>}
      <LotusDivider className={`mx-auto mt-3 w-56 ${light ? "text-gold-300" : "text-gold-500"}`} />
    </Reveal>
  );
}
