/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Gray85: "#D9D9D9",
        Gray40: "#666666",
        grayshade: "#f5f5f5 ",
        grayTextColor: "#868686",
        semiBlack: "#171717",

        strongBlue: "#0F33D1",
        hoverColor: "#3366FF",
        primaryCta: "#22543D ",
        secondaryColor: "#3FFCDD",
        activeTab: "#1c3984",
        hoverTab: "#2b57ab",
        success: "#1AB097",
      },
    },
  },
  plugins: [],
};
