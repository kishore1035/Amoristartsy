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
          50: "#fdfaf7",
          100: "#f7eee4",
          200: "#eedcc9",
          300: "#dfc1a4",
          400: "#c89f78",
          500: "#aa7a50", // Artisanal Light Brown / Café Au Lait
          600: "#916238", // Rich Warm Hazelnut
          700: "#754a26", // Deep Roasted Mocha
        },
        amber: {
          50: "#fdfaf7",  // Soft Linen Cream
          100: "#f7eee4", // Warm Latte
          200: "#eedcc9", // Gentle Almond
          300: "#dfc1a4", // Warm Sand
          400: "#c89f78", // Toasted Caramel
          500: "#aa7a50", // Signature Artisanal Light Brown
          600: "#916238", // Rich Warm Hazelnut
          700: "#754a26", // Mocha Wood
          800: "#5c371b", // Rich Chestnut
          900: "#442813", // Deep Velvet Roast
          950: "#271609",
        },
        accent: {
          terracotta: "#a16040", // Warm Clay & Soft Sienna Brown
          peach: "#f6ded3",
          sage: "#d8e2dc",
          coral: "#eed2c8",
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
        "hero-gradient": "radial-gradient(circle at 50% 30%, rgba(200, 159, 120, 0.35) 0%, rgba(247, 238, 228, 0.4) 45%, rgba(250, 247, 242, 0) 100%)",
        "bottom-blue-gradient": "linear-gradient(180deg, rgba(250, 247, 242, 0) 0%, rgba(234, 242, 255, 0.9) 50%, rgba(214, 228, 255, 1) 100%)",
        "card-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%)",
        "glow-amber": "radial-gradient(circle, rgba(170, 122, 80, 0.32) 0%, transparent 70%)",
        "glow-blue": "radial-gradient(circle, rgba(163, 196, 243, 0.45) 0%, transparent 70%)",
      },
      boxShadow: {
        "warm-amber": "0 10px 30px -5px rgba(170, 122, 80, 0.28)",
        "warm-terracotta": "0 10px 30px -5px rgba(161, 96, 64, 0.25)",
        "blue-glow": "0 10px 30px -5px rgba(163, 196, 243, 0.4)",
        "glass": "0 10px 35px 0 rgba(100, 80, 60, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
