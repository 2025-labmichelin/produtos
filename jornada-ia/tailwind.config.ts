import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:      "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        secondary:    "var(--color-secondary)",
        bg:           "var(--color-bg)",
        "bg-alt":     "var(--color-bg-alt)",
        "bg-card":    "var(--color-bg-card)",
        ink:          "var(--color-text)",
        accent:       "var(--color-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
        ui:      ["var(--font-ui)"],
      },
      boxShadow: {
        card:  "3px 3px 0px #8B6914",
        btn:   "2px 2px 0px #8B6914",
        hover: "4px 4px 0px #8B6914",
      },
      borderRadius: {
        card: "14px",
        btn:  "4px",
      },
    },
  },
  plugins: [],
};
export default config;
