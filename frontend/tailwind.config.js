/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#050a14', // Deeper Navy background
                    800: '#151e32', // Dark Slate cards
                },
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                },
                indigo: {
                    500: '#6366f1',
                    600: '#4f46e5',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
