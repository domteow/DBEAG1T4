/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#141332',
				primary: '#6359e9',
				secondary: '#64cff6',
				card: '#1d1d41',
				hover: '#4E43E4',
			},
		},
	},
	plugins: [],
};
