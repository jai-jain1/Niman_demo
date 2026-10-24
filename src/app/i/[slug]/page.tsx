import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InviteExperience } from "@/components/invite/invite-experience";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getInvite, invites } from "@/content/invites";
import { formatDate } from "@/lib/invite-utils";

export function generateStaticParams() {
  return Object.keys(invites).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/i/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const invite = getInvite(slug);
  if (!invite) return {};
  const title = `${invite.partner1.first} weds ${invite.partner2.first}`;
  const description = `You are cordially invited to celebrate the wedding of ${invite.partner1.first} & ${invite.partner2.first} — ${formatDate(invite.weddingDate)}, ${invite.venue.city}.`;
  return {
    title,
    description,
    openGraph: { title: `💌 ${title}`, description, type: "website" },
    robots: { index: false, follow: false },
  };
}

async function Invitation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invite = getInvite(slug);
  if (!invite) notFound();
  return <InviteExperience invite={invite} />;
}

export default function InvitePage({ params }: PageProps<"/i/[slug]">) {
  return (
    <SmoothScroll>
      {/* Night-sky placeholder matches the gate's backdrop, so there is no flash. */}
      <Suspense fallback={<div className="h-dvh bg-maroon-900" />}>
        <Invitation params={params} />
      </Suspense>
    </SmoothScroll>
  );
}
