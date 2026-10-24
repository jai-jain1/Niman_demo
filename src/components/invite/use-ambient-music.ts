"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SongClip } from "@/content/invites/types";

type Track = { clip: SongClip; el: HTMLAudioElement; gain: GainNode | null; failed: boolean };

const FADE = 3;

/**
 * Wedding soundtrack.
 *  1. On the gate tap, the short `entry` clip (50–60 s, starting at `start`)
 *     plays — the "baraat entry" moment.
 *  2. As it nears `duration`, it crossfades into the looping `background` song.
 *  3. If a file is missing or blocked, a synthesised tanpura + santoor in Raag
 *     Bhupali plays instead, so the invite is never silent.
 * Everything is routed through Web Audio so fades also work on iOS Safari.
 */
export function useAmbientMusic(music?: { entry?: SongClip; background?: SongClip }) {
  const [playing, setPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const tracks = useRef<{ entry?: Track; background?: Track }>({});
  const current = useRef<"entry" | "background" | "synth" | null>(null);
  const synthTimer = useRef<number | null>(null);
  const synthOut = useRef<GainNode | null>(null);
  const started = useRef(false);

  // Preload the files so the entry song starts the instant the seal is tapped.
  useEffect(() => {
    const make = (clip?: SongClip): Track | undefined => {
      if (!clip) return undefined;
      const el = new Audio();
      el.preload = "auto";
      el.src = clip.src;
      const t: Track = { clip, el, gain: null, failed: false };
      el.addEventListener("error", () => (t.failed = true));
      return t;
    };
    const t = { entry: make(music?.entry), background: make(music?.background) };
    tracks.current = t;
    return () => {
      t.entry?.el.pause();
      t.background?.el.pause();
    };
  }, [music?.entry, music?.background]);

  const ensureCtx = () => {
    if (!ctx.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current = new AC();
      master.current = ctx.current.createGain();
      master.current.connect(ctx.current.destination);
    }
    if (ctx.current.state === "suspended") void ctx.current.resume();
    return ctx.current;
  };

  const ramp = (g: GainNode, to: number, secs: number) => {
    const ac = ctx.current!;
    g.gain.cancelScheduledValues(ac.currentTime);
    g.gain.setValueAtTime(g.gain.value, ac.currentTime);
    g.gain.linearRampToValueAtTime(to, ac.currentTime + secs);
  };

  const wire = (t: Track) => {
    const ac = ensureCtx();
    if (!t.gain) {
      t.gain = ac.createGain();
      t.gain.gain.value = 0;
      ac.createMediaElementSource(t.el).connect(t.gain).connect(master.current!);
    }
    return t.gain;
  };

  /* ---------- synthesised fallback ---------- */
  const startSynth = useCallback((intro = true) => {
    const ac = ensureCtx();
    current.current = "synth";
    setNowPlaying("Shehnai & tanpura");
    const out = ac.createGain();
    out.gain.value = 0;
    out.connect(master.current!);
    out.gain.linearRampToValueAtTime(0.5, ac.currentTime + 2.5);
    synthOut.current = out;

    const verb = ac.createConvolver();
    const len = ac.sampleRate * 3.2;
    const ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    verb.buffer = ir;
    const wet = ac.createGain();
    wet.gain.value = 0.55;
    out.connect(verb).connect(wet).connect(master.current!);
    const dry = ac.createGain();
    dry.connect(out);

    const SA = 138.59;
    const pluck = (freq: number, t: number, gain = 0.18, decay = 3.6) => {
      [1, 1.003].forEach((det) => {
        const o = ac.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = freq * det;
        const f = ac.createBiquadFilter();
        f.type = "lowpass";
        f.Q.value = 6;
        f.frequency.setValueAtTime(freq * 9, t);
        f.frequency.exponentialRampToValueAtTime(freq * 2.2, t + decay);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
        o.connect(f).connect(g).connect(dry);
        o.start(t);
        o.stop(t + decay + 0.1);
      });
    };
    const santoor = (freq: number, t: number) => {
      [1, 2.01].forEach((h, i) => {
        const o = ac.createOscillator();
        o.type = i ? "sine" : "triangle";
        o.frequency.value = freq * h;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(i ? 0.03 : 0.09, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
        o.connect(g).connect(dry);
        o.start(t);
        o.stop(t + 2);
      });
    };
    // Dhol-like thump for the opening moment.
    const dhol = (t: number, gain = 0.5) => {
      const o = ac.createOscillator();
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(48, t + 0.25);
      const g = ac.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g).connect(dry);
      o.start(t);
      o.stop(t + 0.45);
    };
    const t0 = ac.currentTime + 0.05;
    if (intro) [0, 0.22, 0.44, 0.88, 1.1].forEach((d, i) => dhol(t0 + d, i === 3 ? 0.7 : 0.45));

    const scale = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, (2 * 9) / 8, (2 * 5) / 4];
    const phrases = [
      [0, 1, 2, -1, 3, -1, 2, 1],
      [2, 3, 4, -1, 5, -1, 4, 3],
      [5, 4, 3, 2, -1, 3, 2, -1],
      [2, 1, 0, -1, 1, 2, 0, -1],
    ];
    const tanpura = [SA * 0.75, SA, SA, SA / 2];
    const beat = 0.62;
    let step = 0;
    let next = ac.currentTime + (intro ? 1.4 : 0.1);
    const schedule = () => {
      while (next < ac.currentTime + 1.2) {
        if (step % 2 === 0) pluck(tanpura[(step / 2) % 4], next);
        const bar = Math.floor(step / 8);
        if (bar % 2 === 1) {
          const n = phrases[Math.floor(bar / 2) % phrases.length][step % 8];
          if (n >= 0) santoor(SA * 2 * scale[n], next);
        }
        step++;
        next += beat;
      }
    };
    schedule();
    synthTimer.current = window.setInterval(schedule, 400);
  }, []);  

  const stopSynth = useCallback(() => {
    if (synthTimer.current) window.clearInterval(synthTimer.current);
    synthTimer.current = null;
    const out = synthOut.current;
    if (out && ctx.current) {
      ramp(out, 0, 0.8);
      setTimeout(() => out.disconnect(), 900);
    }
    synthOut.current = null;
  }, []);  

  /* ---------- song tracks ---------- */
  const playBackground = useCallback(
    (fadeIn = FADE) => {
      const t = tracks.current.background;
      if (!t || t.failed) return startSynth();
      const g = wire(t);
      current.current = "background";
      setNowPlaying(t.clip.title ?? null);
      t.el.loop = true;
      if (t.clip.start) t.el.currentTime = t.clip.start;
      t.el.play().then(
        () => ramp(g, t.clip.volume ?? 0.7, fadeIn),
        () => startSynth(),
      );
      t.el.onerror = () => current.current === "background" && startSynth();
    },
    [startSynth], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const playEntry = useCallback(() => {
    const t = tracks.current.entry;
    if (!t || t.failed) return playBackground(1.5);
    const g = wire(t);
    current.current = "entry";
    setNowPlaying(t.clip.title ?? null);
    const start = t.clip.start ?? 0;
    const end = start + (t.clip.duration ?? 55);
    t.el.currentTime = start;
    let handedOff = false;
    const handOff = () => {
      if (handedOff) return;
      handedOff = true;
      ramp(g, 0, FADE);
      setTimeout(() => t.el.pause(), FADE * 1000 + 100);
      playBackground(FADE);
    };
    t.el.ontimeupdate = () => t.el.currentTime >= end - FADE && handOff();
    t.el.onended = handOff;
    t.el.onerror = () => current.current === "entry" && playBackground(1.5);
    // play() must be called synchronously inside the tap for iOS autoplay rules.
    t.el.play().then(
      () => ramp(g, t.clip.volume ?? 0.9, 1.2),
      () => playBackground(1.5),
    );
  }, [playBackground]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    ensureCtx();
    setPlaying(true);
    if (!started.current) {
      started.current = true;
      ramp(master.current!, 1, 0.01);
      playEntry();
      return;
    }
    // Resume whatever was playing.
    ramp(master.current!, 1, 0.6);
    const c = current.current;
    if (c === "synth") startSynth(false);
    else if (c) void tracks.current[c]?.el.play();
  }, [playEntry, startSynth]);  

  const pause = useCallback(() => {
    setPlaying(false);
    if (!ctx.current || !master.current) return;
    ramp(master.current, 0, 0.5);
    const c = current.current;
    setTimeout(() => {
      if (c === "synth") stopSynth();
      else if (c) tracks.current[c]?.el.pause();
    }, 520);
  }, [stopSynth]);  

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  // Pause when the tab is hidden — guests often hop to WhatsApp mid-invite.
  useEffect(() => {
    const onVis = () => document.hidden && playing && pause();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing, pause]);

  useEffect(
    () => () => {
      if (synthTimer.current) window.clearInterval(synthTimer.current);
      void ctx.current?.close();
    },
    [],
  );

  return { playing, nowPlaying, play, pause, toggle };
}
