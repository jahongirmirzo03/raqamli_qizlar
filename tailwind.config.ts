import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B0714",
          card: "#150F24",
          primary: "#A78BFA",
          accent: "#8B5CF6",
          text: "#F5F3FF",
          muted: "#C4B5FD",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        purple: "0 10px 30px -10px rgba(139, 92, 246, 0.25)",
        "purple-sm": "0 4px 16px -4px rgba(167, 139, 250, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
