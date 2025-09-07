<template>
  <div class="auth-layout">
    <header class="auth-header">
      <NuxtLink to="/" class="logo">
        <h1>Your App</h1>
      </NuxtLink>
    </header>

    <main class="auth-main">
      <slot />
    </main>

    <footer class="auth-footer">
      <p>&copy; 2024 Your App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// This layout is for authentication pages
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
}

.logo {
  text-decoration: none;
  color: #333;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.auth-main {
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
}

.auth-footer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.875rem;
}
</style>
