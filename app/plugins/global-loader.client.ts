export default defineNuxtPlugin({
  name: "global-loader",
  setup() {
    const globalLoader = useGlobalLoader();

    // Start with loader showing for initial load only
    globalLoader.showLoader("Initializing app...");

    // Handle client-side navigation
    if (import.meta.client) {
      const router = useRouter();

      // Show loader immediately on route changes
      router.beforeEach((to, from, next) => {
        if (to.path !== from.path) {
          globalLoader.showLoader("Loading page...");
        }
        next();
      });

      // Hide loader after route change is complete and page is rendered
      router.afterEach((to) => {
        // Check if the destination route is SSR
        const isSSRRoute = to.path === "/users-ssr" || to.meta?.ssr === true;

        if (isSSRRoute) {
          // For SSR routes, let the page component handle hiding the loader
          // Don't auto-hide here as the page needs to be fully mounted and hydrated
          console.log("SSR route detected, page will handle loader hiding");
        } else {
          // For SPA routes, hide loader after ensuring page is mounted
          nextTick(() => {
            // Add a small delay to ensure smooth transition for SPA pages
            setTimeout(() => {
              globalLoader.hideLoader();
            }, 100); // Reduced delay for SPA pages
          });
        }
      });

      // Also handle navigation errors
      router.onError(() => {
        globalLoader.hideLoader();
      });
    }
  },
});
