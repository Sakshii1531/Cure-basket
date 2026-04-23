/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00A8A8",
        "primary-light": "#4DD0E1",
        "primary-dark": "#008E8E",
        secondary: "#E6F7F7",
        "secondary-soft": "#CFF4F4",
        background: "#FFFFFF",
        section: "#F5F7FA",
        border: "#E0E0E0",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B7280",
        accent: "#FFC107",
        success: "#4CAF50",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
}
