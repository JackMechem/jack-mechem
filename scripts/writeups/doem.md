## Overview

Doem is a candle shop in Los Angeles. I was contracted to build its online store, frontend and backend. I built it as a reusable platform: branding and the product catalog live in a CMS, not in the code, so the same platform could be redeployed for future clients.

## What I built

The site is built on the Next.js App Router. Hygraph (a GraphQL CMS) holds all the content, Stripe handles payments, Shippo handles shipping, and Resend sends email.

- **Content model.** The shop page is driven by product categories, each with its own video and mobile GIF. Each product has variations, and each variation has its own price, weight, images and color. Variation button sets drive the picker on the product page. Logos, the company description and landing-page colors come from Hygraph as well, so another shop means new content, not new code.
- **Cart.** A Zustand store persisted to `localStorage`, so the cart survives reloads.

## Checkout: never trust the cart's prices

The cart lives in the browser, so the checkout route ignores any prices it sends. It takes the variation slugs and queries Hygraph for the real names, prices and images. It mirrors each variation into Stripe as a product whose ID is the slug, then creates a Checkout session from those products. The session takes cards and Cash App, collects a US shipping address, applies a flat ground rate and allows promotion codes.

## Orders are created after payment

No order exists until Stripe calls the webhook. The handler takes only the session ID from the event and retrieves the session from Stripe itself, with line items and customer details expanded. From that data it:

1. creates the order in Hygraph, with the address and line items linked back to the product variations;
2. creates a Shippo order with both addresses, the line items and a package weight summed from the variations' weights;
3. sends a React Email receipt through Resend to the customer and the shop owners.

After Checkout, Stripe sends the customer to `/shop?id=<session>`. That page looks up the order by its Stripe checkout ID and shows a confirmation with the order number.

Shipping changed along the way. My first webhook used EasyPost to buy the cheapest label automatically. I switched to Shippo, where the webhook creates an order and the label is bought against it.

## Performance

The shop leans on video and product photography. I moved images to `next/image` with sharp, preloaded product images on the shop page, and kept Stripe.js from blocking the first render.

## What I'd change

- Verify the `Stripe-Signature` header with `constructEvent` and check `payment_status`, on top of re-fetching the session.
- Create a new Stripe Price whenever a variation's price changes in Hygraph. Right now the Stripe product is created only once, so later price edits don't carry over.
