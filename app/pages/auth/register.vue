<template>
  <div class="auth-page">
    <UiRegisterForm title="Create Your Account" :redirect-to="redirectTo" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

// Handle redirect parameter
const route = useRoute();
const redirectTo = (route.query.redirect as string) || "/profile";
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
