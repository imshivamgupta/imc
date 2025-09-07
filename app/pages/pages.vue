<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Pages Manager</h1>

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

// Use global auth composable
const {
  user,
  isAuthenticated,
  token,
  login: authLogin,
  logout: authLogout,
} = useAuth();

// Reactive data
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
    console.log("API Call:", endpoint, options);

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
      console.log("Using token:", token.value);
    } else {
      console.log("No token available");
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("Response data:", jsonResponse);
    return jsonResponse;
  },
};

// Page functions

const loadPages = async () => {
  loading.value = true;
  console.log("Loading pages - isAuthenticated:", isAuthenticated.value);
  console.log("showMyPages:", showMyPages.value);
  console.log("searchTerm:", searchTerm.value);

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

    console.log("Final endpoint:", endpoint);

    const response = await api.call(endpoint);
    console.log("loadPages response:", response);

    if (response.success) {
      pages.value = response.data.pages || [];
      console.log("Pages loaded:", pages.value.length);
    } else {
      console.log("Response not successful:", response);
    }
  } catch (error) {
    console.error("loadPages error:", error);
    showMessage("Failed to load pages: " + error.message, "error");
  } finally {
    loading.value = false;
  }
};

const deletePage = async (slug) => {
  if (!confirm("Are you sure you want to delete this page?")) return;

  console.log("Deleting page:", slug);

  try {
    const response = await api.call(`/pages/${slug}`, {
      method: "DELETE",
    });

    console.log("deletePage response:", response);

    if (response.success) {
      showMessage("Page deleted successfully!");
      await loadPages();
    } else {
      console.log("Delete not successful:", response);
      showMessage("Failed to delete page", "error");
    }
  } catch (error) {
    console.error("deletePage error:", error);
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
onMounted(async () => {
  await loadPages();
});
</script>
