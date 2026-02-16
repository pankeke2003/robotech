/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                // Define el movimiento: 0% arriba, 100% a la mitad del contenido total
                'scroll-y': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-50%)' }, 
                },
            },
            animation: {
                // Usa la variable CSS --scroll-speed si está definida, sino 30s por defecto.
                'vertical-scroll': 'scroll-y var(--scroll-speed, 30s) linear infinite', 
            },
        },
    },
    plugins: [
        require('tailwindcss-animated')
    ],
};