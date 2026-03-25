import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
      },
      colors: {
        brand: {
          primary: "var(--color-primary)",
          "primary-light": "var(--color-primary-light)",
          accent: "var(--color-accent)",
          "accent-light": "var(--color-accent-light)",
        },
        surface: {
          dark: "var(--color-bg-dark)",
          medium: "var(--color-bg-medium)",
          light: "var(--color-bg-light)",
        },
        content: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          dark: "var(--color-text-dark)",
        },
        line: {
          DEFAULT: "var(--color-border)",
          accent: "var(--color-border-accent)",
        },
      },
      maxWidth: { content: "1400px" },
    },
  },
  plugins: [],
};
export default config;
