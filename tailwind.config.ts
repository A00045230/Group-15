import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1a2744",
        "navy-light": "#243356",
        gold: "#f0a500",
      },
    },
  },
  plugins: [],
};

export default config;
