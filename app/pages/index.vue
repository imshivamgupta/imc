<template>
  <div class="home-page">
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">Welcome to Your App</h1>
        <p class="hero-subtitle">
          A modern full-stack application with authentication, user management,
          and more.
        </p>

        <div v-if="!isAuthenticated" class="hero-actions">
          <NuxtLink to="/auth/register" class="btn btn-primary">
            Get Started
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-secondary">
            Sign In
          </NuxtLink>
        </div>

        <div v-else class="hero-welcome">
          <h2>Welcome back, {{ user?.name }}! 👋</h2>
          <NuxtLink to="/profile" class="btn btn-primary">
            View Profile
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Quick Navigation</h2>
        <div class="nav-cards">
          <NuxtLink to="/users" class="nav-card">
            <div class="card-icon">👥</div>
            <h3>Users Management</h3>
            <p>
              Create, edit, and manage users with profile images (Client-side)
            </p>
          </NuxtLink>

          <NuxtLink
            to="/users-ssr"
            class="nav-card ssr-card"
            @click="navigateToSSR"
          >
            <div class="card-icon">🚀</div>
            <h3>Users Management (SSR)</h3>
            <p>Server-side rendered users page with image support</p>
          </NuxtLink>

          <NuxtLink to="/posts" class="nav-card posts-card">
            <div class="card-icon">📝</div>
            <h3>Posts</h3>
            <p>Browse posts from JSONPlaceholder API</p>
          </NuxtLink>

          <NuxtLink
            v-if="isAuthenticated"
            to="/profile"
            class="nav-card profile-card"
          >
            <div class="card-icon">👤</div>
            <h3>Your Profile</h3>
            <p>View and edit your profile information</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="app-features">
      <div class="container">
        <h2>App Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Authentication</h3>
            <p>
              Secure user registration, login, and password management with JWT
              tokens.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👤</div>
            <h3>User Profiles</h3>
            <p>
              Complete user profile management with image uploads and personal
              information.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Content Management</h3>
            <p>
              Create, edit, and manage posts and other content with full CRUD
              operations.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Modern Stack</h3>
            <p>
              Built with Nuxt 3, TypeScript, PostgreSQL, and modern development
              practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: "Home",
});

// Auth composable
const { user, isAuthenticated } = useAuth();

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
.home-page {
  min-height: calc(100vh - 64px);
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.hero-welcome {
  margin-top: 2rem;
}

.hero-welcome h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.btn-primary {
  background: white;
  color: #3b82f6;
}

.btn-primary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: #3b82f6;
  transform: translateY(-2px);
}

.features {
  padding: 4rem 0;
  background: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.nav-card {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.posts-card {
  background: linear-gradient(135deg, #10b981, #059669);
}

.ssr-card {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.profile-card {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.nav-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.nav-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
  line-height: 1.4;
}

.app-features {
  padding: 4rem 0;
  background: #f9fafb;
}

.app-features h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
  }

  .features h2,
  .app-features h2 {
    font-size: 2rem;
  }

  .nav-cards,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
