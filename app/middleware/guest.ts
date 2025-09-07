export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to profile
  if (isAuthenticated.value) {
    return navigateTo("/profile");
  }
});
