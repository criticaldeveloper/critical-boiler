import { defineConfig } from "vite";
{{ viteFrameworkPluginImport }}
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [{{ vitePlugins }}],
});
