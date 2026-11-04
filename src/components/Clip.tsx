"use client";

import { useEffect, useRef, useState } from "react";
import type { Clip as ClipDoc } from "@/lib/types";

type Clip = Pick<
  ClipDoc,
  "src" | "poster" | "title" | "detail" | "alt" | "credit" | "creditUrl"
>;

/**
 * Live clips with a selector underneath. Plays muted while on screen
 * (browsers block autoplay with sound); the sound setting carries across clips.
 */
export function Clip({ clips }: { clips: Clip[] }) {
  const video = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const visible = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (still && v.muted) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // switching clips: start the new one right away
  useEffect(() => {
    const v = video.current;
    if (v && visible.current) v.play().catch(() => {});
  }, [current]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  const clip = clips[current];
  if (!clip) return null;

  return (
    <div className="reel">
      <div className="reel-stage">
        <video
          ref={video}
          key={clip.src}
          src={clip.src}
          poster={clip.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-label={clip.alt}
        />
        <div className="reel-cap">
          <b>{clip.title}</b>
          <span className="cap reel-meta">
            {clip.detail}
            {clip.credit && (
              <span>
                Filmed by{" "}
                {clip.creditUrl ? (
                  <a
                    href={clip.creditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {clip.credit} ↗
                  </a>
                ) : (
                  clip.credit
                )}
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          className="clip-sound"
          aria-pressed={!muted}
          onClick={toggleSound}
        >
          {muted ? "♪ Sound on" : "■ Mute"}
        </button>
      </div>
      <ul className="reel-list" aria-label="Clips">
        {clips.map((c, i) => (
          <li key={c.src + i}>
            <button
              type="button"
              aria-current={i === current}
              onClick={() => setCurrent(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {c.poster ? (
                <img src={c.poster} alt="" />
              ) : (
                <video
                  src={`${c.src}#t=2`}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              )}
              <span>
                <span className="cap">{String(i + 1).padStart(2, "0")}</span>
                <b>{c.title}</b>
                <small>{c.detail}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
