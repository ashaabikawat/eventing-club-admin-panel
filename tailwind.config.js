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
      },
    },
  },
  plugins: [],
};
