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
        strongBlue: "#2B5C9A",
        mildBlue: "#2E74B9",
        ctaBlue: "#4A90E2",
      },
    },
  },
  plugins: [],
};
