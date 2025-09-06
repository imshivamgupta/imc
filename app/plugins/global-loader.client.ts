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
      router.afterEach(() => {
        // Wait for the next tick to ensure the new page component is mounted
        nextTick(() => {
          // Add a small delay to ensure smooth transition
          setTimeout(() => {
            globalLoader.hideLoader();
          }, 200);
        });
      });

      // Also handle navigation errors
      router.onError(() => {
        globalLoader.hideLoader();
      });
    }
  },
});
