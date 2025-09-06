export const useNavigationLoader = () => {
  const globalLoader = useGlobalLoader();
  const router = useRouter();

  // Override NuxtLink behavior to show loader
  const navigateTo = async (to: string) => {
    // Show loader immediately
    globalLoader.showLoader("Loading page...");

    try {
      // Navigate to the route
      await router.push(to);
    } catch (error) {
      // Hide loader on error
      globalLoader.hideLoader();
      throw error;
    }
  };

  return {
    navigateTo,
  };
};
