## Overview

Mike Mechem Real Estate is a freelance website for a real estate business in the Las Vegas area. It has two parts, both built on Next.js 14 with the App Router. The first is the main site: a landing page and About and Info pages that the client edits himself, plus a contact form. The second is a home search over live MLS listings.

## Pages the client can build

All the regular pages come from Contentful through its GraphQL API. Instead of fixed page templates, I modeled a page as a stack of blocks. Each block holds columns, and each column holds rows that are a button, an image, a text section or a video. Blocks have flags for full-bleed layout and card layout.

One `[slug]` route renders any page from that structure, so the client can add or rearrange pages without me. The contact page posts to Web3Forms, so the site needs no backend for email.

## MLS home search

For listings I worked directly against the Trestle MLS API (CoreLogic), an OData service:

- **Auth.** Trestle uses OAuth client credentials. The token is cached through Next's `fetch` under an `auth` tag and revalidated once it expires. It all runs in server actions, so the secret stays on the server.
- **Queries.** Filters live in the URL's search params: price range, property type, beds, baths, garage, pool and senior communities. Searches are shareable and work with the back button. The server turns those params into an OData `$filter`, `$select`s about fifty fields, expands each listing's photos in order and pages through results 12 at a time.
- **Location search.** Typing an address or neighborhood calls Google Places Autocomplete, restricted to a rectangle around southern Nevada so results stay local. The chosen place is geocoded, and its viewport becomes a latitude and longitude bounding box in the Trestle query.
- **Map and list.** Results appear on a Mapbox map next to a listing column. A small Zustand store holds the hovered listing for each side, so hovering a card highlights its marker, and hovering a marker scrolls the list to that card.

## How it ended

The search got as far as working filters, location search, the synced map, listing pages and mobile layouts. In the end I took it off the site's routes, and the site as it stands is the Contentful-driven pages plus the contact form. The last changes were content edits I made with the client during a meeting.

## What I learned

- Modeling a page as nested blocks costs more up front than templates, but it's what lets the client add and rearrange pages himself.
- A real MLS feed meant handling token lifetimes, OData query building and gaps in the data, such as missing lot sizes and an on-market date that was always null.
