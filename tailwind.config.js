import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#B91C1C",
          crimsonDark: "#7F1D1D",
          navy: "#1E3A5F",
          saffron: "#D97706",
        },
      },
    },
  },
  plugins: [],
};
export default config;