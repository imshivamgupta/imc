<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <button @click="navigateToHome" class="btn btn-secondary back-btn">
          ← Back to Home
        </button>
        <h1>Users Management</h1>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Add New User
      </button>
    </div>

    <!-- Users List -->
    <div class="users-section">
      <ClientOnly>
        <div v-if="pending" class="loading">
          <div class="loading-spinner"></div>
          <p>Loading users...</p>
        </div>

        <div v-else-if="error" class="error">
          <h3>Failed to load users</h3>
          <p>{{ error?.message || error || "An unexpected error occurred" }}</p>
          <button @click="refresh()" class="btn btn-primary retry-btn">
            Try Again
          </button>
        </div>

        <div v-else-if="!users?.data?.users?.length" class="empty-state">
          <h3>No users found</h3>
          <p>Get started by creating your first user.</p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            Create First User
          </button>
        </div>

        <div v-else>
          <div class="users-stats">
            <p>Total Users: {{ users?.data?.total || 0 }}</p>
          </div>

          <div class="users-grid">
            <div
              v-for="user in users?.data?.users"
              :key="user.id"
              class="user-card"
            >
              <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p class="email">{{ user.email }}</p>
                <div class="details">
                  <span v-if="user.age">Age: {{ user.age }}</span>
                  <span v-if="user.phone">Phone: {{ user.phone }}</span>
                </div>
                <p class="created-at">
                  <ClientOnly>
                    Created: {{ formatDate(user.created_at) }}
                    <template #fallback>
                      Created: {{ user.created_at.split("T")[0] }}
                    </template>
                  </ClientOnly>
                </p>
              </div>
              <div class="user-actions">
                <button @click="editUser(user)" class="btn btn-secondary">
                  Edit
                </button>
                <button @click="deleteUser(user.id)" class="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="users?.data && users.data.total > 10" class="pagination">
            <button
              @click="loadPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="btn"
            >
              Previous
            </button>
            <span>Page {{ currentPage }}</span>
            <button
              @click="loadPage(currentPage + 1)"
              :disabled="users?.data && currentPage * 10 >= users.data.total"
              class="btn"
            >
              Next
            </button>
          </div>
        </div>

        <template #fallback>
          <div class="loading">Loading users...</div>
        </template>
      </ClientOnly>
    </div>

    <!-- Create/Edit User Modal -->
    <div
      v-if="showCreateModal || editingUser"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingUser ? "Edit User" : "Create New User" }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="submitUser" class="user-form">
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              id="name"
              v-model="userForm.name"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="userForm.email"
              type="email"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input
              id="age"
              v-model.number="userForm.age"
              type="number"
              min="1"
              max="150"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              id="phone"
              v-model="userForm.phone"
              type="tel"
              class="form-input"
            />
          </div>

          <div v-if="formError" class="form-error">
            {{ formError }}
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="btn btn-primary"
            >
              {{ submitting ? "Saving..." : editingUser ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
  };
  message?: string;
  error?: string;
}

interface UserForm {
  name: string;
  email: string;
  age?: number;
  phone?: string;
}

// Set page metadata
useHead({
  title: "Users Management",
});

// Global loader
const globalLoader = useGlobalLoader();

// Navigation with loader
const navigateToHome = async () => {
  globalLoader.showLoader("Loading Home...");
  await navigateTo("/");
};

// Reactive state
const showCreateModal = ref(false);
const editingUser = ref<User | null>(null);
const submitting = ref(false);
const formError = ref("");
const currentPage = ref(1);
const limit = 10;

// User form data
const userForm = ref<UserForm>({
  name: "",
  email: "",
  age: undefined,
  phone: "",
});

// Fetch users with pagination
const {
  data: users,
  pending,
  error,
  refresh,
} = await useLazyFetch<ApiResponse>("/api/users", {
  key: "users-list", // Add unique key for caching
  query: {
    limit,
    offset: computed(() => (currentPage.value - 1) * limit),
    orderBy: "created_at",
    orderDirection: "DESC",
  },
  default: () => ({
    success: false,
    data: {
      users: [],
      total: 0,
    },
  }),
  server: false, // Force client-side only since SSR is disabled
  transform: (data: any) => {
    // Transform and validate the response
    return {
      success: data?.success || false,
      data: {
        users: data?.data?.users || [],
        total: data?.data?.total || 0,
      },
      message: data?.message,
      error: data?.error,
    };
  },
});

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Use a consistent format that works the same on server and client
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const resetForm = () => {
  userForm.value = {
    name: "",
    email: "",
    age: undefined,
    phone: "",
  };
  formError.value = "";
};

const closeModal = () => {
  showCreateModal.value = false;
  editingUser.value = null;
  resetForm();
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    name: user.name,
    email: user.email,
    age: user.age,
    phone: user.phone,
  };
};

const submitUser = async () => {
  submitting.value = true;
  formError.value = "";

  try {
    if (editingUser.value) {
      // Update existing user
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: "PUT",
        body: userForm.value,
      });
    } else {
      // Create new user
      await $fetch("/api/users", {
        method: "POST",
        body: userForm.value,
      });
    }

    // Refresh the users list
    await refresh();
    closeModal();
  } catch (err: any) {
    console.error('Submit user error:', err);
    formError.value = err?.data?.error || err?.message || "An error occurred";
  } finally {
    submitting.value = false;
  }
};

const deleteUser = async (userId: number) => {
  if (!confirm("Are you sure you want to delete this user?")) {
    return;
  }

  // Show loading state
  const originalUsers = users.value?.data?.users || [];
  
  try {
    // Optimistic update - remove from UI immediately
    if (users.value?.data?.users) {
      users.value.data.users = users.value.data.users.filter(u => u.id !== userId);
      users.value.data.total = Math.max(0, users.value.data.total - 1);
    }

    await $fetch("/api/users", {
      method: "DELETE",
      query: { id: userId },
    });

    // Refresh to ensure data consistency
    await refresh();
  } catch (err: any) {
    console.error('Delete user error:', err);
    
    // Revert optimistic update on error
    if (users.value?.data) {
      users.value.data.users = originalUsers;
      users.value.data.total = originalUsers.length;
    }
    
    alert("Error deleting user: " + (err.data?.error || err.message || "Unknown error"));
  }
};

const loadPage = async (page: number) => {
  if (page === currentPage.value || page < 1) return;
  
  // Show loading immediately
  currentPage.value = page;
  
  // The useLazyFetch will automatically refetch when currentPage changes
  // due to the computed offset parameter
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #ef4444;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

.error h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
}

.retry-btn {
  margin-top: 1rem;
}

.empty-state {
  color: #6b7280;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.users-stats {
  margin-bottom: 1rem;
  color: #6b7280;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.email {
  color: #3b82f6;
  margin: 0.25rem 0;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.created-at {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.5rem 0 1rem 0;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.user-actions .btn {
  flex: 1;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.user-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-error {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
