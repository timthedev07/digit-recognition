module.exports = {
  content: [
    "./src/pages/**/*.{tsx,ts}",
    "./src/components/**/*.{ts,tsx}",
    "node_modules/dragontail-experimental/dist/cjs/index.js",
  ],
  darkMode: "class",
  mode: "jit",
  theme: {
    extend: {
      keyframes: {
        loadingGrow: {
          from: {
            left: 0,
            width: 0,
          },
          to: {
            left: 0,
            width: "100%",
          },
        },
      },
      animation: {
        "loading-grow": "loadingGrow 2s cubic-bezier(1,.11,0,.89) forwards",
      },
    },
  },
};
