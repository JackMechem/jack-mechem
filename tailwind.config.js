/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#F0F5FC",
      secondary: "#D9DFE5",
      blue: "#428CE2",
      green: "#5DD776",
      foreground: "#364F6B",
      "foreground-sec": "#7B899A",
    },
    extend: {
      dropShadow: {
        bluexl: "10px 10px 0px theme(colors.blue)",
        bluexlr: "-10px 10px 0px theme(colors.blue)",
        bluemd: "4px 4px 0px theme(colors.blue)",
        "secondary-lg": "0px 5px 8px theme(colors.secondary)",
        "secondary-right": "3px 5px 5px theme(colors.secondary)",
      },
      boxShadow: {
        "secondary-center": "0px 0px 10px 9px theme(colors.secondary)",
      },
      keyframes: {
        slideInDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
        page: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
      animation: {
        slideInDown: "slideInDown 0.1s ease-in-out 1",
        page: "page 1s ease-in-out 1",
      },
    },
  },
  plugins: [
    require("tailwindcss-themer")({
      defaultTheme: {
        // put the default values of any config you want themed
        // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
        extend: {
          colors: {
            primary: "#F0F5FC",
            secondary: "#D9DFE5",
            blue: "#428CE2",
            green: "#5DD776",
            foreground: "#364F6B",
            "foreground-sec": "#7B899A",
          },
        },
      },
      themes: [
        {
          // name your theme anything that could be a valid css class name
          // remember what you named your theme because you will use it as a class to enable the theme
          name: "dark-theme",
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              primary: "#20232C",
              secondary: "#232A32",
              blue: "#428CE2",
              green: "#5DD776",
              foreground: "#A1AEBD",
              "foreground-sec": "#6878D3",
            },
          },
        },
      ],
    }),
  ],
};
