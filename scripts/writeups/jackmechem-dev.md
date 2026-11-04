## Overview

This is my portfolio. It shows my software to people hiring and my drumming to people booking gigs. I built it as a record shop. Projects are records filed in crates by category, each with a sleeve, a catalogue number and a Side A and Side B of features. Gigs and live clips fill out the rest.

I wanted to update it without redeploying, so the content lives in a database and the site has its own admin panel.

## What I built

- **Next.js 16** (App Router) and **React 19**, styled with plain CSS.
- **Convex** holds projects, crates, gigs and clips. Write-ups like this one are Markdown rendered with react-markdown, and drafts stay hidden.
- **Vercel Blob** stores uploaded clips and images.
- **`/admin`** edits all of it, with a live Markdown preview for write-ups.

## Cached pages that update on save

Public pages read Convex on the server through its HTTP query API, using `fetch` so Next caches each result for an hour under a tag. Every admin save calls `updateTag` and revalidates the layout, so changes show up immediately and visitors still get cached pages.

The fetch helper throws on any failure. During background revalidation that means an unreachable Convex leaves the last good page in place instead of caching an empty one. Gigs and clips catch their errors instead, so the page still renders without them. A new project gets its `/work/<slug>` page on first request, with no rebuild.

## Admin without a user system

There's one admin, so auth stays small. The password is checked in constant time by hashing both sides and comparing with `timingSafeEqual`. A login sets an HMAC-signed, expiring, `httpOnly`, `SameSite=Strict` cookie scoped to `/admin`.

Convex mutations also require an `ADMIN_SECRET` that only the Next.js server knows. Convex functions are publicly reachable, but writes are rejected without the secret. Input is validated inside Convex as well: slug format, length limits, and links that must be `https://` or a site path.

## Uploads straight to Blob

Video is too big to route through a serverless function. The browser asks `/admin/upload` for a short-lived Blob token, issued only to a signed-in admin, limited to video and image types and capped at 300 MB. It then uploads directly, switching to multipart above 50 MB.

For clips, the browser also grabs a frame through a `<canvas>` to make the poster image. If it can't decode the file (an iPhone HEVC clip in Chrome, for example), that step fails, which is an early warning that the clip won't play on the site.

## Making the crate feel physical

Scrolling over the records flips through them. The first wheel tick flips immediately, then one record per 180 px. A gesture that has flipped a record stays with the crate, so trackpad momentum can't fling the page. A fresh gesture at either end scrolls the page as usual. Wheel deltas are normalised across pixel, line and page modes, and vertical swipes flip records on touch screens.
