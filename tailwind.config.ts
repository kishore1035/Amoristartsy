import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf7f2", // Warm Linen Canvas Cream
        surface: "#f4efe6",    // Soft Warm Studio Paper
        "surface-light": "#efe8dc", // Pastel Linen Panel
        primary: {
          50: "#fffbeb",
          400: "#f59e0b",
          500: "#d97706", // Warm Studio Amber
          600: "#b45309",
        },
        accent: {
          terracotta: "#c85032",
          peach: "#fcd5ce",
          sage: "#d8e2dc",
          coral: "#fec5bb",
          pastelblue: "#d0e1fd", // Soft Pastel Sky Blue for bottom
          deepblue: "#3b82f6",
        },
        ink: {
          main: "#2d261e",
          muted: "#6e6255",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        handwriting: ["var(--font-caveat)", "Caveat", "cursive"],
        calligraphy: ["var(--font-caveat)", "Caveat", "cursive"],
        mono: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 50% 30%, rgba(254, 215, 170, 0.45) 0%, rgba(254, 202, 202, 0.3) 45%, rgba(250, 247, 242, 0) 100%)",
        "bottom-blue-gradient": "linear-gradient(180deg, rgba(250, 247, 242, 0) 0%, rgba(234, 242, 255, 0.9) 50%, rgba(214, 228, 255, 1) 100%)",
        "card-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%)",
        "glow-amber": "radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, transparent 70%)",
        "glow-blue": "radial-gradient(circle, rgba(163, 196, 243, 0.45) 0%, transparent 70%)",
      },
      boxShadow: {
        "warm-amber": "0 10px 30px -5px rgba(217, 119, 6, 0.25)",
        "warm-terracotta": "0 10px 30px -5px rgba(200, 80, 50, 0.25)",
        "blue-glow": "0 10px 30px -5px rgba(163, 196, 243, 0.4)",
        "glass": "0 10px 35px 0 rgba(100, 80, 60, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
