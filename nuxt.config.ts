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

  // Tailwind CSS configuration
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            gray: {
              50: '#f9fafb',
              100: '#f3f4f6',
              200: '#e5e7eb',
              300: '#d1d5db',
              400: '#9ca3af',
              500: '#6b7280',
              600: '#4b5563',
              700: '#374151',
              800: '#1f2937',
              900: '#111827',
            },
          },
        },
      },
    },
  },
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
    // Base URL for GitHub Pages - explicitly set for repository deployment
    baseURL: process.env.NUXT_APP_BASE_URL || "/imc/",
    cdnURL: process.env.NUXT_APP_BASE_URL || "/imc/",
    buildAssetsDir: "_nuxt/",
  },

  // Vite configuration for proper asset handling
  vite: {
    base: process.env.NUXT_APP_BASE_URL || "/imc/",
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
