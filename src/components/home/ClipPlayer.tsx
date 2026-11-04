"use client";

/**
 * The Archive video player: the current clip with its title, venue/date and
 * "Filmed by" credit printed over it, and a row of cards to switch clips.
 * The list ends with a "more coming soon" card (site.archiveSoon).
 * Clips (edited in /admin/clips) autoplay muted while on screen — browsers
 * block autoplay with sound — and the Sound on button unmutes.
 * Styles: styles/music.css (.player-…)
 */
import { useEffect, useRef, useState } from "react";
import { pad2 } from "@/lib/format";
import type { Clip } from "@/lib/types";
import { site } from "@/content/site";
import { Arrow } from "@/components/layout/Arrow";

export function ClipPlayer({ clips }: { clips: Clip[] }) {
  const video = useRef<HTMLVideoElement>(null);
  const onScreen = useRef(false);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);

  // Play while at least a quarter of the player is visible; pause otherwise.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        if (reducedMotion && v.muted) return; // don't autoplay for people who asked for less motion
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  // switching clips: start the new one straight away
  useEffect(() => {
    const v = video.current;
    if (v && onScreen.current) v.play().catch(() => {});
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
    <div className="player">
      <div className="player-screen">
        <video ref={video} key={clip.src} src={clip.src} poster={clip.poster} muted={muted} loop playsInline preload="metadata" aria-label={clip.alt} />
        <div className="player-caption">
          <b>{clip.title}</b>
          <span className="cap player-meta">
            {clip.detail}
            {clip.credit && (
              <span>
                Filmed by{" "}
                {clip.creditUrl ? (
                  <a href={clip.creditUrl} target="_blank" rel="noopener noreferrer">
                    {clip.credit} <Arrow dir="out" />
                  </a>
                ) : (
                  clip.credit
                )}
              </span>
            )}
          </span>
        </div>
        <button type="button" className="player-sound" aria-pressed={!muted} onClick={toggleSound}>
          {muted ? "♪ Sound on" : "■ Mute"}
        </button>
      </div>

      <ul className="player-list" aria-label="Clips">
        {clips.map((c, i) => (
          <li key={c._id}>
            <button type="button" aria-current={i === current} onClick={() => setCurrent(i)}>
              {/* no preview image: show a frame from the video itself */}
              {c.poster ? (
                // eslint-disable-next-line @next/next/no-img-element -- small thumbnail of a file in public/ or Blob
                <img src={c.poster} alt="" />
              ) : (
                <video src={`${c.src}#t=2`} muted playsInline preload="metadata" aria-hidden="true" />
              )}
              <span>
                <span className="cap">{pad2(i + 1)}</span>
                <b>{c.title}</b>
                <small>{c.detail}</small>
              </span>
            </button>
          </li>
        ))}
        {site.archiveSoon && (
          <li className="player-soon">
            <span className="player-soon-tape" aria-hidden="true" />
            <span>
              <span className="cap">{pad2(clips.length + 1)}</span>
              <b>{site.archiveSoon.title}</b>
              <small>{site.archiveSoon.text}</small>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
