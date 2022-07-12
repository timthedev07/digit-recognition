module.exports = {
  content: [
    "./src/pages/**/*.{tsx,ts}",
    "./src/components/**/*.{ts,tsx}",
    "node_modules/dragontail-experimental/dist/cjs/index.js",
  ],
  darkMode: "class",
  mode: "jit",
  variants: {
    extend: {
      typography: ["dark"],
      cursor: ["focus"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
