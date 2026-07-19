import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["~/src/styles/index.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
