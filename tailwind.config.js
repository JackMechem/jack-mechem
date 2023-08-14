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
                secondary: "0px 3px 5px rgba(234, 240, 239, 1)",
            },
        },
    },
    plugins: [],
};
