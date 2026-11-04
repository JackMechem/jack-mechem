export const site = {
  name: "Jack Mechem",
  url: "https://jackmechem.dev",
  email: "mechemjack@gmail.com",
  github: "https://github.com/JackMechem",
  linkedin: "https://www.linkedin.com/in/jackmechem",

  hero: "I build real-time audio software and developer tools in Rust and TypeScript.",
  heroSub: "CS student at CSUN, looking for internships. I also play drums.",
  status: "Looking for internships",

  bio: [
    "I'm a computer science student at Cal State Northridge (graduating May 2028). I build audio software and developer tools, mostly in Rust and TypeScript: a DAW written from scratch, a library for a guitar pedal whose protocol I reverse engineered, and a practice platform for musicians.",
    "I've been writing software since middle school, from Linux desktop tooling and Nix configs to paid client websites. When I'm not at a keyboard I'm usually behind a drum kit, playing jazz, funk and R&B gigs around LA.",
  ],

  /** Paid software work, newest first (shown on /cv). */
  experience: [
    {
      org: "Doem",
      role: "Contract full-stack engineer",
      where: "Los Angeles, CA",
      when: "Aug – Nov 2024",
      points: [
        "Built a candle shop as a reusable e-commerce platform with configurable branding and catalogues, so it could be redeployed for future clients.",
        "Next.js storefront with Stripe Checkout, Shippo shipping and Hygraph as the CMS.",
      ],
    },
    {
      org: "FreelandBuck",
      role: "Contract frontend engineer",
      where: "Remote",
      when: "Jun – Jul 2023",
      points: [
        "Moved an architecture firm's site from WordPress to Next.js and Contentful, delivering the production site in two months.",
        "Wrote a script that migrated the firm's content from Azure SQL to Contentful.",
      ],
    },
    {
      org: "Freelance web developer",
      role: "Independent",
      where: "Remote",
      when: "2023 – 2024",
      points: [
        "Mike Mechem Real Estate: Next.js site with Contentful pages and an MLS home search (Trestle API, Mapbox).",
        "Vachegowanus: an interactive viewer for architectural drawings with clickable plans and 360° panoramas (React, three.js).",
      ],
    },
  ],

  /** Music (shown on /cv). */
  music: [
    { org: "Freelance drummer", role: "Jazz, funk, soul & R&B", where: "Los Angeles, CA", when: "2024 – now", points: ["Gigging regularly around LA, including the Toledo Show at Petit Ermitage."] },
    { org: "Vic's Las Vegas", role: "Jazz drummer", where: "Las Vegas, NV", when: "2022 – 2024", points: ["Regular jazz gigs with rotating musicians, where the repertoire changed on the spot."] },
  ],

  education: { org: "California State University, Northridge", what: "B.S. Computer Science", when: "Expected May 2028" },

  skills: {
    Languages: "Rust, TypeScript, C, C++, Java, Python, SQL, Lua, Nix",
    Audio: "Real-time engines, VST3 hosting, MIDI/SysEx, JACK, PipeWire, ALSA, DSP filter fitting, NAM",
    Desktop: "Tauri 2, iced, Wayland layer-shell, GTK4/gtkmm",
    Web: "React, Next.js, Convex, Axum, Javalin, Stripe",
    Infra: "NixOS, Nix flakes, systemd, Docker, GitHub Actions, AWS",
  } as Record<string, string>,
};
