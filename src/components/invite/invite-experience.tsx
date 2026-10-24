"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Invite } from "@/content/invites/types";
import { formatDayNum, formatMonthShort, formatYear } from "@/lib/invite-utils";
import { Dock } from "./dock";
import { EnvelopeIntro } from "./envelope-intro";
import { VideoIntro } from "./video-intro";
import { Events } from "./events";
import { GateIntro } from "./gate-intro";
import { Hero } from "./hero";
import { Invocation } from "./invocation";
import { InviteTheme } from "./linen";
import { CardHero } from "./card-hero";
import { PearlHero } from "./pearl-hero";
import { Journey } from "./journey";
import { PetalShower } from "./petal-shower";
import { Rsvp } from "./rsvp";
import { SaveTheDate } from "./save-the-date";
import { Story } from "./story";
import { ThankYou } from "./thank-you";
import { useAmbientMusic } from "./use-ambient-music";
import { Family, Venue } from "./venue-family";

const noopSubscribe = () => () => {};

/** Reads ?to=Sharma%20Parivar so every family gets a personal greeting. */
function useGuestName() {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("to")?.trim().slice(0, 60) || null,
    () => null,
  );
}

export function InviteExperience({ invite }: { invite: Invite }) {
  const guest = useGuestName();
  const music = useAmbientMusic(invite.music);
  const [revealed, setRevealed] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  // If the filmed opening can't load, fall back to the 3D envelope.
  const [videoFailed, setVideoFailed] = useState(false);
  const dateLine = `${formatDayNum(invite.weddingDate)} · ${formatMonthShort(invite.weddingDate)} · ${formatYear(invite.weddingDate)}`;
  const useVideo = invite.entry === "video" && invite.openingVideo && !videoFailed;
  const lenis = useLenis();
  const initials: [string, string] = [invite.partner1.first[0], invite.partner2.first[0]];
  const names = `${invite.partner1.first} & ${invite.partner2.first}`;

  const theme = invite.theme ?? "royal";
  // The page background (overscroll, safe areas) follows the theme too.
  useEffect(() => {
    document.documentElement.classList.toggle("theme-pearl", theme === "pearl");
    return () => document.documentElement.classList.remove("theme-pearl");
  }, [theme]);

  // Every visit starts at the gate, never at a restored scroll position.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (gateGone) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    }
    else {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    }
  }, [lenis, gateGone]);

  useEffect(() => {
    document.documentElement.style.overflow = gateGone ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [gateGone]);

  return (
    <InviteTheme.Provider value={theme}>
    <main className={`relative ${theme === "pearl" ? "theme-pearl bg-ivory" : ""}`}>
      {useVideo ? (
        <VideoIntro
          guest={guest}
          partner1={invite.partner1.first}
          partner2={invite.partner2.first}
          dateLine={dateLine}
          city={invite.venue.city}
          video={invite.openingVideo!}
          onOpenStart={music.play}
          onReveal={() => setRevealed(true)}
          onDone={() => setGateGone(true)}
          onFail={() => setVideoFailed(true)}
        />
      ) : invite.entry === "gate" ? (
        <GateIntro
          guest={guest}
          initials={initials}
          names={names}
          art={invite.intro}
          onOpenStart={music.play}
          onReveal={() => setRevealed(true)}
          onDone={() => setGateGone(true)}
        />
      ) : (
        <EnvelopeIntro
          guest={guest}
          initials={initials}
          names={names}
          dateLine={dateLine}
          onOpenStart={music.play}
          onReveal={() => setRevealed(true)}
          onDone={() => setGateGone(true)}
        />
      )}
      <PetalShower active={revealed} colors={theme === "pearl" ? PEARL_PETALS : undefined} />

      {theme === "pearl" && invite.openingVideo ? (
        <CardHero invite={invite} video={invite.openingVideo} dateLine={dateLine} revealed={revealed} />
      ) : theme === "pearl" ? (
        <PearlHero invite={invite} revealed={revealed} />
      ) : (
        <Hero invite={invite} revealed={revealed} />
      )}
      <Invocation invite={invite} />
      <SaveTheDate invite={invite} />
      <Story invite={invite} />
      <Journey invite={invite} />
      <Events invite={invite} />
      <Venue invite={invite} />
      <Family invite={invite} />
      <Rsvp invite={invite} guest={guest} />
      <ThankYou invite={invite} />

      {gateGone && (
        <Dock
          playing={music.playing}
          nowPlaying={music.nowPlaying}
          onToggleMusic={music.toggle}
          shareTitle={`${invite.partner1.first} weds ${invite.partner2.first}`}
        />
      )}
    </main>
    </InviteTheme.Provider>
  );
}

const PEARL_PETALS = ["#fbf6ee", "#efe4d4", "#e3d2bb", "#d8c4a6", "#f5ebe4", "#c9b08c"];
