import { ImageResponse } from "next/og";
import { getInvite, invites } from "@/content/invites";
import { formatDate } from "@/lib/invite-utils";

export const alt = "Wedding invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(invites).map((slug) => ({ slug }));
}

/** The preview card guests see when the link is shared on WhatsApp. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invite = getInvite(slug);
  const a = invite?.partner1.first ?? "Niman";
  const b = invite?.partner2.first ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 30%, #24387a 0%, #0f1f4d 45%, #050a1e 100%)",
          color: "#f8edd0",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "2px solid rgba(227,194,122,.6)",
            borderRadius: 28,
            display: "flex",
          }}
        />
        <div style={{ fontSize: 26, letterSpacing: 12, color: "#e3c27a", display: "flex" }}>YOU ARE INVITED</div>
        <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 30 }}>
          <span style={{ fontSize: 120, fontStyle: "italic", color: "#efd9a0" }}>{a}</span>
          <span style={{ fontSize: 40, color: "#e3c27a" }}>&</span>
          <span style={{ fontSize: 120, fontStyle: "italic", color: "#efd9a0" }}>{b}</span>
        </div>
        {invite && (
          <div style={{ marginTop: 26, fontSize: 34, letterSpacing: 4, display: "flex" }}>
            {formatDate(invite.weddingDate)} · {invite.venue.city}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 56, fontSize: 20, letterSpacing: 8, color: "rgba(248,237,208,.6)", display: "flex" }}>
          TAP TO OPEN · NIMAN
        </div>
      </div>
    ),
    size,
  );
}
