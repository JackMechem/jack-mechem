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
            primary: "#F2F8F7",
            secondary: "#EAF0EF",
            accent: "#436E7F",
            foreground: "#16252A",
            "foreground-light": "#28414C",
            border: "#B6C3C1",
        },
        extend: {
            dropShadow: {
                secondary: "0px 3px 5px theme(colors.secondary)",
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
                    // colors is used here for demonstration purposes
                    colors: {
                        primary: "#F2F8F7",
                        secondary: "#EAF0EF",
                        accent: "#436E7F",
                        foreground: "#16252A",
                        "foreground-light": "#28414C",
                        border: "#B6C3C1",
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
                            primary: "#243740",
                            secondary: "#16252A",
                            accent: "#436E7F",
                            foreground: "#B3C7CD",
                            "foreground-light": "#A5C8D3",
                            border: "#406976",
                        },
                    },
                },
            ],
        }),
    ],
};
