import type { Invite } from "./types";

/**
 * Demo invitation. To onboard a new couple, duplicate this file, edit the
 * details and register it in ./index.ts — the whole site is generated from it.
 */
export const arjunWedsMeera: Invite = {
  slug: "arjun-weds-meera",
  partner1: {
    first: "Arjun",
    full: "Arjun Malhotra",
    parents: "Smt. Kavita Malhotra & Shri Rakesh Malhotra",
    relation: "Son",
  },
  partner2: {
    first: "Meera",
    full: "Meera Desai",
    parents: "Smt. Sunita Desai & Shri Anil Desai",
    relation: "Daughter",
  },
  weddingDate: "2027-02-20T19:30:00+05:30",
  hashtag: "#ArjunKiMeera",
  shloka: ["॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।", "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥"],
  invitationLine:
    "Together with our beloved families, we request the honour of your gracious presence as we begin our forever.",
  from: { city: "Mumbai", code: "BOM", state: "Maharashtra", date: "18 FEB" },
  to: { city: "Udaipur", code: "UDR", state: "Rajasthan", date: "20 FEB" },
  story: {
    intro:
      "Ours is not a story of years of knowing each other. It is a story of two people meeting at exactly the right time.",
    chapters: [
      {
        year: "2021",
        title: "A chai, a monsoon, a hello",
        text: "A delayed local train, a crowded tapri at Bandra and one shared umbrella. Arjun offered the umbrella; Meera offered to split the cutting chai. Neither of them caught the next train.",
        scene: "city",
      },
      {
        year: "2023",
        title: "Mountains & long conversations",
        text: "A road trip to Manali turned into a promise. Somewhere between Maggi at 3 a.m. and the snow at Rohtang, they both quietly knew.",
        scene: "mountains",
      },
      {
        year: "2025",
        title: "The question at sunset",
        text: "On the beaches of Goa, with a ring hidden in a coconut (don't ask), Arjun asked. Meera said yes before he finished the sentence.",
        scene: "beach",
      },
      {
        year: "2027",
        title: "Forever, by the lake",
        text: "And now, with both families beaming, we come to the City of Lakes to begin our forever — and we cannot imagine it without you.",
        scene: "lake",
      },
    ],
  },
  events: [
    {
      id: "mehndi",
      theme: "mehndi",
      title: "Mehndi",
      hindi: "मेहंदी",
      tagline: "Henna, laughter & a little bit of masti",
      start: "2027-02-18T16:00:00+05:30",
      end: "2027-02-18T20:00:00+05:30",
      venue: "Bagh-e-Gulab Lawns",
      address: "Sheesh Mahal Palace, Lake Pichola, Udaipur",
      mapQuery: "Lake Pichola Udaipur Rajasthan",
      dressCode: { label: "Shades of green & pink", colors: ["#5b7a2e", "#a3b86c", "#e88aa0", "#f6c9d3"] },
    },
    {
      id: "haldi",
      theme: "haldi",
      title: "Haldi",
      hindi: "हल्दी",
      tagline: "A splash of sunshine before the big day",
      start: "2027-02-19T10:00:00+05:30",
      end: "2027-02-19T13:00:00+05:30",
      venue: "The Poolside Courtyard",
      address: "Sheesh Mahal Palace, Lake Pichola, Udaipur",
      mapQuery: "Lake Pichola Udaipur Rajasthan",
      dressCode: { label: "Yellow, white & marigold", colors: ["#f2c230", "#ffe48a", "#ffffff", "#f2a007"] },
    },
    {
      id: "sangeet",
      theme: "sangeet",
      title: "Sangeet & Cocktails",
      hindi: "संगीत",
      tagline: "Music, dance and a night to remember",
      start: "2027-02-19T19:30:00+05:30",
      end: "2027-02-20T00:30:00+05:30",
      venue: "Durbar Hall",
      address: "Sheesh Mahal Palace, Lake Pichola, Udaipur",
      mapQuery: "Lake Pichola Udaipur Rajasthan",
      dressCode: { label: "Indo-western glam — jewel tones", colors: ["#3b2d7a", "#6a54b5", "#c0b3ee", "#d4ab5a"] },
    },
    {
      id: "wedding",
      theme: "wedding",
      title: "The Wedding",
      hindi: "शुभ विवाह",
      tagline: "Baraat at 5:30 PM · Pheras at 7:30 PM",
      start: "2027-02-20T17:30:00+05:30",
      end: "2027-02-20T23:30:00+05:30",
      venue: "The Lakeside Mandap",
      address: "Sheesh Mahal Palace, Lake Pichola, Udaipur",
      mapQuery: "Lake Pichola Udaipur Rajasthan",
      dressCode: { label: "Traditional — reds, golds & ivory", colors: ["#8c1c2e", "#c0392b", "#d4ab5a", "#f6eee2"] },
    },
    {
      id: "reception",
      theme: "reception",
      title: "Reception",
      hindi: "स्वागत समारोह",
      tagline: "An evening of gratitude, dinner & dancing",
      start: "2027-02-21T20:00:00+05:30",
      end: "2027-02-21T23:59:00+05:30",
      venue: "The Moonlit Terrace",
      address: "Sheesh Mahal Palace, Lake Pichola, Udaipur",
      mapQuery: "Lake Pichola Udaipur Rajasthan",
      dressCode: { label: "Black tie — or your finest ivory", colors: ["#141414", "#3a3a3a", "#e9dcc4", "#d4ab5a"] },
    },
  ],
  venue: {
    name: "Sheesh Mahal Palace",
    city: "Udaipur, Rajasthan",
    address: "Lake Pichola, Old City, Udaipur, Rajasthan 313001",
    mapQuery: "Lake Pichola Udaipur Rajasthan",
    notes: [
      "Boat transfers to the palace run every 15 minutes from the Ghat jetty.",
      "Valet parking is available at the City Palace gate.",
      "The venue is wheelchair accessible — just let us know in your RSVP.",
    ],
  },
  blessings: [
    { title: "Grandparents", people: ["Smt. Kamla Devi & Late Shri Jaswant Malhotra", "Smt. Lata & Shri Mohanlal Desai"] },
    { title: "Parents", people: ["Smt. Kavita & Shri Rakesh Malhotra", "Smt. Sunita & Shri Anil Desai"] },
    { title: "Bhaiya & Bhabhi", people: ["Rohan & Nisha Malhotra"] },
    { title: "Didi & Jiju", people: ["Riddhi & Parth Mehta"] },
  ],
  littleOnes: {
    names: ["Diya", "Krish", "Vivaan"],
    line: "Don't forget to come to our chachu's wedding!",
    lineHindi: "मेरे चाचू की शादी में ज़रूर आना",
  },
  travel: [
    { icon: "plane", title: "By air", text: "Maharana Pratap Airport (UDR) is 25 minutes away. Direct flights from Mumbai, Delhi, Bengaluru & Ahmedabad." },
    { icon: "train", title: "By train", text: "Udaipur City station is 15 minutes from the venue. Our team will receive you with a placard." },
    { icon: "hotel", title: "Stay", text: "Rooms are blocked for all guests at the palace from 18–22 Feb. Simply share your arrival details in the RSVP." },
    { icon: "car", title: "Transfers", text: "Complimentary pick-ups and drops for the airport, station and all functions." },
  ],
  faqs: [
    { q: "What's the weather like in February?", a: "Pleasant days around 26°C and cool evenings around 12°C. Carry a light shawl for the lakeside functions." },
    { q: "Are children welcome?", a: "Of course! There is a kids' corner with games and a nanny at every function." },
    { q: "Is there a gift registry?", a: "Your presence is the greatest gift. If you wish to bless us, a shagun envelope box will be at the reception." },
    { q: "Who do we contact on the day?", a: "Our hospitality desk: Kunal (+91 98XXX XXXXX) is available 24×7 from 17 to 22 February." },
  ],
  rsvp: {
    deadline: "2027-01-15T23:59:00+05:30",
    whatsapp: "919999999999",
    meals: ["Vegetarian", "Jain", "Non-vegetarian"],
  },
  music: {
    // Drop your licensed MP3s at these paths (see README → Music).
    entry: { src: "/invites/arjun-weds-meera/entry.mp3", title: "Aaj Sajeya · Goldie Sohel", start: 0, duration: 55 },
    // No separate background track yet, so the entry song keeps playing on loop.
    // Add background.mp3 and point this at it to use a different song.
    background: { src: "/invites/arjun-weds-meera/entry.mp3", title: "Aaj Sajeya · Goldie Sohel", volume: 0.6 },
  },
  intro: {
    // Generate these with the prompts in ART-PROMPTS.md and drop them in this folder.
    gateVideo: "/invites/arjun-weds-meera/intro/gate-open.mp4",
    gateImage: "/invites/arjun-weds-meera/intro/gate-closed.jpg",
    palaceImage: "/invites/arjun-weds-meera/intro/palace-night.jpg",
    palaceImageWide: "/invites/arjun-weds-meera/intro/palace-night-wide.jpg",
    garland: "/invites/arjun-weds-meera/intro/garland-top.png",
    floralsLeft: "/invites/arjun-weds-meera/intro/florals-left.png",
    floralsRight: "/invites/arjun-weds-meera/intro/florals-right.png",
  },
  thankYou:
    "for being a part of our journey, from Mumbai to Udaipur. Your love and blessings mean the world to us.",
};
