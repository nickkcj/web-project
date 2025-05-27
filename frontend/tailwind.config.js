/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: 'var(--id-color-white)',
        yellow: 'var(--id-color-yellow)',
        'dark-blue': 'var(--id-color-dark-blue)',
        'mid-blue': 'var(--id-color-mid-blue)',
        alert: 'var(--id-color-alert)',
        'modal-bg': 'var(--modal-background)',
      },
      fontFamily: {
        poppins: ['var(--id-font)', 'sans-serif'],
        inter: ['var(--id-font-footer)', 'sans-serif'],
        k2d: ['var(--id-font-k2d)', 'sans-serif'],
      },
      fontSize: {
        xs: 'var(--id-font-size-xs)',
        sm: 'var(--id-font-size-sm)',
        base: 'var(--id-font-size-md)',
        lg: 'var(--id-font-size-lg)',
        xl: 'var(--id-font-size-xl)',
        '2xl': 'var(--id-font-size-xxl)',
      },
      boxShadow: {
        sm: 'var(--id-shadow-sm)',
        md: 'var(--id-shadow-md)',
        lg: 'var(--id-shadow-lg)',
      },
    },
  },
  plugins: [],
};
