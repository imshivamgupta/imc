// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/scripts",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },

  // GitHub Pages deployment configuration
  ssr: false, // Always use SPA mode to avoid prerendering issues

  nitro: {
    preset: "github-pages",
    prerender: {
      routes: [], // No prerendering
      crawlLinks: false, // Don't follow links to discover routes
      ignore: ["/**"], // Ignore all routes for prerendering
    },
  },

  // GitHub Pages configuration
  app: {
    head: {
      title: "Users Management App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Modern user management dashboard built with Vue.js and Nuxt 3",
        },
      ],
    },
    // Base URL for GitHub Pages (will be set by GitHub Actions)
    baseURL: process.env.NUXT_APP_BASE_URL || "/imc/",
    buildAssetsDir: "_nuxt/",
  },

  // Environment variables for build
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    databaseUrl:
      process.env.DATABASE_URL ||
      "postgresql://postgres:password@localhost:5432/inmycity_dev",

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
      appName: "InMyCity",
    },
  },
});
