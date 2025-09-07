<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Pages Manager</h1>

    <!-- Auth Status -->
    <div class="bg-blue-50 p-4 rounded-lg mb-6">
      <div v-if="!isAuthenticated" class="flex gap-4">
        <Button @click="showLogin = true" variant="default"> Login </Button>
        <Button @click="showRegister = true" variant="secondary">
          Register
        </Button>
      </div>
      <div v-else class="flex justify-between items-center">
        <span>Welcome! You can create and manage pages.</span>
        <div class="flex gap-2">
          <Button as-child>
            <NuxtLink to="/create-page">
              <Plus class="mr-2 h-4 w-4" />
              Create Page
            </NuxtLink>
          </Button>
          <Button @click="logout" variant="destructive"> Logout </Button>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div
      v-if="showLogin"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Login</h2>
        <form @submit.prevent="login">
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="Email"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <div class="flex gap-2">
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <button
              @click="showLogin = false"
              type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Register Modal -->
    <div
      v-if="showRegister"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Register</h2>
        <form @submit.prevent="register">
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Name"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="Email"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Password"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <div class="flex gap-2">
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>
            <button
              @click="showRegister = false"
              type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Page Form -->
    <div v-if="isAuthenticated" class="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 class="text-xl font-bold mb-4">Create New Page</h2>
      <form @submit.prevent="createPage">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            v-model="pageForm.slug"
            type="text"
            placeholder="Page Slug (e.g., my-page)"
            class="p-2 border rounded"
            required
          />
          <input
            v-model="pageForm.title"
            type="text"
            placeholder="Page Title"
            class="p-2 border rounded"
            required
          />
        </div>
        <textarea
          v-model="pageForm.content"
          placeholder="Page Content"
          class="w-full p-2 border rounded mb-4"
          rows="4"
          required
        ></textarea>
        <input
          v-model="pageForm.description"
          type="text"
          placeholder="Description (optional)"
          class="w-full p-2 border rounded mb-4"
        />
        <div class="flex gap-4 items-center mb-4">
          <label class="flex items-center">
            <input v-model="pageForm.is_public" type="checkbox" class="mr-2" />
            Make this page public
          </label>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded">
          Create Page
        </button>
      </form>
    </div>

    <!-- Pages List -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Public Pages</h2>
        <div class="flex gap-2">
          <input
            v-model="searchTerm"
            @input="searchPages"
            type="text"
            placeholder="Search pages..."
            class="p-2 border rounded"
          />
          <button
            v-if="isAuthenticated"
            @click="showMyPages = !showMyPages"
            :class="showMyPages ? 'bg-blue-500' : 'bg-gray-500'"
            class="text-white px-4 py-2 rounded"
          >
            {{ showMyPages ? "Show All" : "My Pages" }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">Loading...</div>

      <div v-else class="grid gap-4">
        <div
          v-for="page in pages"
          :key="page.id"
          class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">{{ page.title }}</h3>
            <div class="flex gap-2">
              <a
                :href="`/pages/${page.slug}`"
                class="text-blue-500 hover:underline text-sm"
                >View</a
              >
              <button
                v-if="page.can_edit"
                @click="editPage(page)"
                class="text-green-500 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                v-if="page.can_edit"
                @click="deletePage(page.slug)"
                class="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-2">{{ page.description }}</p>
          <p class="text-gray-800 mb-2">
            {{ page.content.substring(0, 200)
            }}{{ page.content.length > 200 ? "..." : "" }}
          </p>
          <div class="text-xs text-gray-500 flex justify-between">
            <span>By: {{ page.owner_name }}</span>
            <span
              >Created:
              {{ new Date(page.created_at).toLocaleDateString() }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div
      v-if="message"
      class="fixed bottom-4 right-4 p-4 rounded text-white"
      :class="messageType === 'error' ? 'bg-red-500' : 'bg-green-500'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";

// Reactive data
const isAuthenticated = ref(false);
const token = ref("");
const showLogin = ref(false);
const showRegister = ref(false);
const showMyPages = ref(false);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");
const searchTerm = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const pageForm = ref({
  slug: "",
  title: "",
  content: "",
  description: "",
  is_public: true,
});

const pages = ref([]);

// API helpers
const api = {
  async call(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// Auth functions
const login = async () => {
  try {
    const response = await api.call("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginForm.value),
    });

    if (response.success) {
      token.value = response.data.token;
      isAuthenticated.value = true;
      showLogin.value = false;
      showMessage("Logged in successfully!");
      await loadPages();
    }
  } catch (error) {
    showMessage("Login failed: " + error.message, "error");
  }
};

const register = async () => {
  try {
    const response = await api.call("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerForm.value),
    });

    if (response.success) {
      showMessage("Registration successful! Please login.");
      showRegister.value = false;
    }
  } catch (error) {
    showMessage("Registration failed: " + error.message, "error");
  }
};

const logout = () => {
  token.value = "";
  isAuthenticated.value = false;
  showMessage("Logged out successfully!");
  loadPages();
};

// Page functions
const createPage = async () => {
  try {
    const response = await api.call("/pages", {
      method: "POST",
      body: JSON.stringify(pageForm.value),
    });

    if (response.success) {
      showMessage("Page created successfully!");
      pageForm.value = {
        slug: "",
        title: "",
        content: "",
        description: "",
        is_public: true,
      };
      await loadPages();
    }
  } catch (error) {
    showMessage("Failed to create page: " + error.message, "error");
  }
};

const loadPages = async () => {
  loading.value = true;
  try {
    let endpoint = "/pages";
    const params = new URLSearchParams();

    if (searchTerm.value) {
      params.append("search", searchTerm.value);
    }

    if (showMyPages.value && isAuthenticated.value) {
      params.append("my_pages", "true");
    }

    if (params.toString()) {
      endpoint += "?" + params.toString();
    }

    const response = await api.call(endpoint);

    if (response.success) {
      pages.value = response.data.pages || [];
    }
  } catch (error) {
    showMessage("Failed to load pages: " + error.message, "error");
  } finally {
    loading.value = false;
  }
};

const deletePage = async (slug) => {
  if (!confirm("Are you sure you want to delete this page?")) return;

  try {
    const response = await api.call(`/pages/${slug}`, {
      method: "DELETE",
    });

    if (response.success) {
      showMessage("Page deleted successfully!");
      await loadPages();
    }
  } catch (error) {
    showMessage("Failed to delete page: " + error.message, "error");
  }
};

const searchPages = () => {
  loadPages();
};

// Utility functions
const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Initialize
onMounted(() => {
  loadPages();
});
</script>
