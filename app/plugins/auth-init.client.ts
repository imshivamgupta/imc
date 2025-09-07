export default defineNuxtPlugin(() => {
  // Initialize auth state on client side
  const { initAuth } = useAuth();
  initAuth();
});
