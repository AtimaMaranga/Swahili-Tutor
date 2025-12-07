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
        // Modern Savanna Design System
        savanna: {
          gold: {
            50: '#FDF8F0',
            100: '#FAEFD9',
            200: '#F5DFB3',
            300: '#EFCF8D',
            400: '#E9BF67',
            500: '#D4A84B', // Primary Gold
            600: '#B8923F',
            700: '#9C7C33',
            800: '#806627',
            900: '#64501B',
          },
          teal: {
            50: '#EFF8F7',
            100: '#D7EFED',
            200: '#AFDEDA',
            300: '#87CEC8',
            400: '#5FBDB5',
            500: '#2A8A84', // Primary Teal (Zanzibar)
            600: '#247571',
            700: '#1E615D',
            800: '#184C4A',
            900: '#123836',
          },
          cream: {
            50: '#FFFFFE',
            100: '#FEFDFB',
            200: '#FCF9F5',
            300: '#FAF6EF', // Paper White
            400: '#F5EFE5',
            500: '#EDE4D4',
            600: '#D9CDB8',
            700: '#C5B69C',
            800: '#B19F80',
            900: '#9D8864',
          },
          earth: {
            50: '#F7F5F3',
            100: '#EFEAE5',
            200: '#DFD5CB',
            300: '#CFC0B1',
            400: '#BFAB97',
            500: '#8B7355', // Earth Brown
            600: '#76614A',
            700: '#614F3F',
            800: '#4C3D34',
            900: '#372B29',
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
