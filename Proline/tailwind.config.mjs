/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            aspectRatio: {
                '21/9': '21 / 9',
                '16/10': '16 / 10',
                '16/9': '16 / 9',
                '9/16': '9 / 16',
                '4/3': '4 / 3',
                '1/1': '1 / 1',
            },
            fontFamily: {
                // Note:
                // Tailwind does not automatically escape font names for you.If you’re using a font that contains an invalid identifier, wrap it in quotes or escape the invalid characters.
                // You will also have to add the @font-face CSS to `style.css`.
                // sansAlt: ['"Barlow Semi Condensed"', ...defaultTheme.fontFamily.sans],
                // sans: ['Roboto', ...defaultTheme.fontFamily.sans],
                // serif: ['"Libre Baskerville"', ...defaultTheme.fontFamily.serif],
                // mono: ['"Fira Code"', ...defaultTheme.fontFamily.mono],
                switzer: [
                    '"Switzer-Variable"',
                    ...defaultTheme.fontFamily.sans,
                ],
                khand: ['"Khand"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                proline: {
                    red: '#D64829',
                    black: '#020202',
                    white: '#FFFFFF',
                },
            },
            maxWidth: {
                screen: '100vw',
                'screen-3xl': '1920px',
            },
            scale: {
                101: '1.01',
                250: '2.5',
            },
            listStyleType: {
                decimal: 'decimal',
                disc: 'disc',
                none: 'none',
                square: 'square',
            },
        },
        screens: {
            xs: '475px',
            ...defaultTheme.screens,
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('tailwind-scrollbar-hide'),
    ],
};
