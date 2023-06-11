const daisyui = require('daisyui');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				script: ['Caveat', 'cursive'],
				minecraft: ['minecraft', 'sans-serif'],
			}
		}
	},

	plugins: [daisyui],
	daisyui: {
    themes: ["light", "dark"],
		darkTheme: "dark"
  },
};

module.exports = config;
