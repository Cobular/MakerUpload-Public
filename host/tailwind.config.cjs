const daisyui = require("daisyui");

const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  plugins: [daisyui],
  safelist: [
    "alert-info",
    "alert-success",
    "alert-warning",
    "alert-error",
  ]
};

module.exports = config;