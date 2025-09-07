<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-logo">
        <h1>Your App</h1>
      </NuxtLink>

      <div class="nav-menu">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/posts" class="nav-link">Posts</NuxtLink>
        <NuxtLink to="/users" class="nav-link">Users</NuxtLink>

        <div v-if="isAuthenticated" class="nav-user">
          <div class="user-dropdown" @click="toggleDropdown">
            <div class="user-avatar">
              <img
                v-if="user?.image_path"
                :src="user.image_path"
                :alt="user.name"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ getUserInitials() }}
              </div>
            </div>
            <span class="user-name">{{ user?.name }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>

          <div v-if="showDropdown" class="dropdown-menu" @click.stop>
            <NuxtLink
              to="/profile"
              class="dropdown-item"
              @click="closeDropdown"
            >
              👤 Profile
            </NuxtLink>
            <button @click="handleLogout" class="dropdown-item logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>

        <div v-else class="nav-auth">
          <NuxtLink to="/auth/login" class="nav-link">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="nav-button">Sign Up</NuxtLink>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
        :class="{ active: showMobileMenu }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <NuxtLink to="/" class="mobile-link" @click="closeMobileMenu"
        >Home</NuxtLink
      >
      <NuxtLink to="/posts" class="mobile-link" @click="closeMobileMenu"
        >Posts</NuxtLink
      >
      <NuxtLink to="/users" class="mobile-link" @click="closeMobileMenu"
        >Users</NuxtLink
      >

      <div v-if="isAuthenticated" class="mobile-user">
        <div class="mobile-user-info">
          <div class="user-avatar small">
            <img
              v-if="user?.image_path"
              :src="user.image_path"
              :alt="user.name"
              class="avatar-img"
            />
            <div v-else class="avatar-placeholder">
              {{ getUserInitials() }}
            </div>
          </div>
          <span class="user-name">{{ user?.name }}</span>
        </div>
        <NuxtLink to="/profile" class="mobile-link" @click="closeMobileMenu">
          👤 Profile
        </NuxtLink>
        <button @click="handleLogout" class="mobile-link logout-btn">
          🚪 Logout
        </button>
      </div>

      <div v-else class="mobile-auth">
        <NuxtLink to="/auth/login" class="mobile-link" @click="closeMobileMenu">
          Login
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="mobile-button"
          @click="closeMobileMenu"
        >
          Sign Up
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth();

// Component state
const showDropdown = ref(false);
const showMobileMenu = ref(false);

// Helper functions
const getUserInitials = () => {
  if (!user.value?.name) return "?";
  return user.value.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const handleLogout = async () => {
  await logout();
  closeDropdown();
  closeMobileMenu();
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", () => {
    showDropdown.value = false;
  });
});
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  text-decoration: none;
  color: #333;
}

.nav-logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
}

.nav-button {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background: #2563eb;
}

.nav-user {
  position: relative;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-dropdown:hover {
  background: #f9fafb;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar.small {
  width: 24px;
  height: 24px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
  color: #374151;
}

.dropdown-arrow {
  font-size: 0.75rem;
  color: #9ca3af;
  transition: transform 0.2s;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #374151;
  font-size: 0.875rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.logout-btn {
  color: #dc2626;
}

.logout-btn:hover {
  background: #fef2f2;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: #374151;
  transition: all 0.3s;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  display: none;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
}

.mobile-link {
  display: block;
  padding: 0.75rem 0;
  text-decoration: none;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  font-weight: 500;
}

.mobile-link:hover {
  color: #3b82f6;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-button {
  display: block;
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  margin-top: 0.5rem;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
