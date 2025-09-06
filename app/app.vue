<template>
  <div>
    <!-- Global Loader -->
    <Transition name="loader" mode="out-in">
      <GlobalLoader
        v-if="globalLoader.isLoading.value"
        :message="globalLoader.message.value"
      />
    </Transition>

    <!-- Root app wrapper -->
    <NuxtLayout>
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
        }"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Global loader
const globalLoader = useGlobalLoader();

// Global app setup
useHead({
  titleTemplate: "%s - Users Management App",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content: "Modern user management dashboard built with Vue.js and Nuxt 3",
    },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});

// Global error handling
const handleError = (error: any) => {
  console.error("Global error:", error);
  globalLoader.hideLoader(); // Hide loader on error
};

// Provide global error handler
provide("handleError", handleError);
</script>

<style>
/* Global styles that apply to the entire app */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
}

/* Global utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: #3b82f6;
}

.text-danger {
  color: #ef4444;
}

.text-success {
  color: #10b981;
}

/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Layout transition */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}

/* Loader transition */
.loader-enter-active,
.loader-leave-active {
  transition: opacity 0.2s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}
</style>
