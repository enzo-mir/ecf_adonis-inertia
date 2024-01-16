module.exports = {
  content: ["./resources/**/*.{edge,js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      fontSize: {
        sm: "var(--font-size-little)",
        base: "var(--font-size)",
        lg: "var(--font-size-reg)",
        xl: "var(--font-size-h1)",
      },
      backgroundImage: {
        "btn-menus": "url('../js/assets/images/barre-de-menu.png')",
      },
    },
  },
  plugins: [],
};
