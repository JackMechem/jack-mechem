## Overview

FreelandBuck is an architecture firm whose website ran on WordPress. They wanted to move it to Next.js with Contentful as the CMS. The plan in the repo's roadmap was to migrate the data into Contentful, launch a copy of the old site for side-by-side review, and then adjust it until it matched the original's content and behavior.

When I joined as a contract frontend engineer, the repo had a Next.js scaffold that could pull project entries from Contentful. I built the site out from there, wrote the content migration, and delivered the production site with all of its content migrated within two months.

## What I built

- **Content migration.** I wrote a script that moved all of the existing content from Azure SQL into Contentful, so nobody had to re-enter projects by hand.
- **Pages.** Landing page, project pages, office page, header, footer, a desktop navigation menu and a mobile hamburger menu, with Framer Motion animations and loading states.
- **Contentful layer.** A small content service over the Contentful SDK, TypeScript types generated from the content model with `contentful-typescript-codegen`, and statically generated pages through `getStaticProps` and `getStaticPaths`. The production build is a static export.
- **Images.** The site is mostly photography, so I moved images to `next/image` with sharp and did a pass to make them display properly on high-DPI screens.

## Rendering migrated content

Migrated project pages are long rich-text documents that mix copy, photos, video and 3D tours. I wrote custom Contentful rich-text renderers to handle them:

- Matterport tours and Vimeo videos pasted into the text as plain links render as full-width embedded players. Video entries embedded in the rich text get the same treatment, with their captions.
- Embedded images are requested from Contentful's image API as WebP and rendered with `next/image`, using the width and height stored on the asset so the layout doesn't shift as photos load.

## Letting the firm control the landing page

The landing page has two horizontally scrolling sections, Architecture and Public Art. The firm needed to choose which projects appear there and in what order, without asking a developer. Each section reads its order from a `projectOrder` entry in Contentful, which holds an ordered list of project references. Reordering the landing page is a content edit, and the project menu on every project page follows the same lists.

## After launch

I kept maintaining the site. In 2024 I changed the content model to replace the separate location and year fields with a multi-line subtitle, and in 2025 I made the site skip projects that have no category.
