// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/scripts", "@nuxt/image", "@nuxt/eslint", "@nuxt/fonts"],

  // Option A: Disable SSR globally
  // ssr: false,

  // Option B: Disable SSR for specific routes
  nitro: {
    routeRules: {
      "/users": { ssr: false }, // Disable SSR for users page
      // '/admin/**': { ssr: false }, // Disable SSR for all admin routes
      // '/dashboard/**': { ssr: false }, // Disable SSR for all dashboard routes
    },
  },

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
  },
});
