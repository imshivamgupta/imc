<template>
  <div class="container">
    <h1>Welcome to Users Management App</h1>
    <p>This is the home page of your Nuxt 3 application.</p>

    <div class="navigation">
      <h2>Quick Navigation</h2>
      <div class="nav-cards">
        <NuxtLink to="/users" class="nav-card">
          <h3>👥 Users Management</h3>
          <p>View, create, edit, and delete users (Client-side)</p>
        </NuxtLink>
        <NuxtLink
          to="/users-ssr"
          class="nav-card ssr-card"
          @click="navigateToSSR"
        >
          <h3>🚀 Users Management (SSR)</h3>
          <p>Server-side rendered users page</p>
        </NuxtLink>
        <NuxtLink to="/posts" class="nav-card posts-card">
          <h3>📝 Posts</h3>
          <p>Browse posts from JSONPlaceholder API</p>
        </NuxtLink>
      </div>
    </div>

    <div class="features">
      <h2>Features</h2>
      <ul>
        <li>User Management API</li>
        <li>External API Integration (JSONPlaceholder)</li>
        <li>Database Integration</li>
        <li>Modern Vue 3 + Nuxt 3</li>
        <li>TypeScript Support</li>
        <li>Client-side Rendering & Server-side Rendering</li>
        <li>Hybrid Rendering Options</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: "Home",
});

// Global loader
const globalLoader = useGlobalLoader();

// Navigation functions
const navigateToSSR = () => {
  globalLoader.showLoader("Loading SSR Users Page...");
  // NuxtLink will handle the actual navigation
};

onMounted(() => {
  // Hide loader when page is fully mounted and hydrated
  nextTick(() => {
    globalLoader.hideLoader();
  });
});
</script>

<style scoped>
.container {
  padding: 2rem;
}

.navigation {
  margin: 2rem 0;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.nav-card {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.posts-card {
  background: linear-gradient(135deg, #10b981, #059669);
}

.ssr-card {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.nav-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.nav-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.features {
  margin-top: 2rem;
}

.features ul {
  list-style-type: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.features li:last-child {
  border-bottom: none;
}
</style>
