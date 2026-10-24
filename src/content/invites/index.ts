import { arjunWedsMeera } from "./arjun-weds-meera";
import type { Invite } from "./types";

/** Register every live invitation here. The slug becomes /i/<slug>. */
export const invites: Record<string, Invite> = {
  [arjunWedsMeera.slug]: arjunWedsMeera,
};

export const getInvite = (slug: string): Invite | undefined => invites[slug];
