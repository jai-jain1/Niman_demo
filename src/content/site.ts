/**
 * Niman brand + sales details. Replace the placeholders before going live.
 */
export const site = {
  name: "Niman",
  tagline: "Nimantran, reimagined.",
  description:
    "Niman crafts cinematic, mobile-first invitation websites for Indian weddings and celebrations — wax-seal reveals, event-wise details, maps, RSVPs and music, all in one link.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://niman.in",
  /** Digits only, with country code. Used for wa.me links. */
  whatsapp: "919999999999",
  email: "hello@niman.in",
  instagram: "https://instagram.com/niman.invites",
  demoSlug: "arjun-weds-meera",
};

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type Plan = {
  name: string;
  hindi: string;
  price: number;
  blurb: string;
  features: string[];
  highlight?: boolean;
};

/** Indicative pricing — edit freely. */
export const plans: Plan[] = [
  {
    name: "Shagun",
    hindi: "शगुन",
    price: 4999,
    blurb: "A graceful single-event invite for intimate ceremonies.",
    features: [
      "Signature wax-seal opening",
      "Up to 2 events with maps & calendar",
      "Countdown + scratch-to-reveal date",
      "WhatsApp RSVP",
      "Delivered in 72 hours",
    ],
  },
  {
    name: "Utsav",
    hindi: "उत्सव",
    price: 9999,
    blurb: "The full wedding story — every function, every family.",
    features: [
      "Everything in Shagun",
      "Unlimited events, each with its own theme",
      "Our Story, journey map & photo gallery",
      "Boarding-pass RSVP to Google Sheets",
      "Personalised link for every guest family",
      "Background music of your choice",
    ],
    highlight: true,
  },
  {
    name: "Maharaja",
    hindi: "महाराजा",
    price: 19999,
    blurb: "Bespoke illustration and a truly one-of-a-kind experience.",
    features: [
      "Everything in Utsav",
      "Custom AI illustrated couple & venue art",
      "Bilingual — English + Hindi / Gujarati / Marathi",
      "Custom domain (e.g. arjunwedsmeera.com)",
      "Live guest-list dashboard",
      "Priority edits till the wedding day",
    ],
  },
];

export const faqs = [
  {
    q: "How do guests open the invitation?",
    a: "It is simply a link. Guests tap it on WhatsApp, Instagram or SMS and it opens instantly in their phone browser — no app, no download, no login.",
  },
  {
    q: "Can every family get a personalised invite?",
    a: "Yes. We generate a unique link per family, so the invitation greets them by name — “Dear Sharma Parivar” — and pre-fills their RSVP.",
  },
  {
    q: "How long does it take?",
    a: "Shagun is delivered in 72 hours. Utsav and Maharaja take 5–7 days depending on the number of events and illustrations, with two rounds of revisions included.",
  },
  {
    q: "Where do the RSVPs go?",
    a: "Straight into a private Google Sheet you own, and optionally to your WhatsApp. You will always know exactly who is coming to which function and their meal preference.",
  },
  {
    q: "Can I change details after sending it?",
    a: "Absolutely — that is the beauty of a website kankotri. Change a venue, time or add a function and every guest sees the update instantly. No reprinting.",
  },
  {
    q: "Do you do invites beyond weddings?",
    a: "Yes — engagements, roka, griha pravesh, mundan, baby showers, milestone birthdays and anniversaries all get the same cinematic treatment.",
  },
];
