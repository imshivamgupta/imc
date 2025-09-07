<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar-container">
          <img
            v-if="profileData.image_path"
            :src="profileData.image_path"
            :alt="profileData.name"
            class="avatar"
          />
          <div v-else class="avatar-placeholder">
            {{ getInitials(profileData.name) }}
          </div>

          <button
            v-if="isEditing"
            @click="triggerFileUpload"
            class="avatar-upload-btn"
            type="button"
          >
            📷
          </button>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            style="display: none"
          />
        </div>
      </div>

      <div class="profile-info">
        <div v-if="!isEditing" class="display-mode">
          <h1 class="profile-name">{{ profileData.name }}</h1>
          <p class="profile-email">{{ profileData.email }}</p>
          <p v-if="profileData.created_at" class="profile-joined">
            Joined {{ formatDate(profileData.created_at) }}
          </p>

          <div class="profile-actions">
            <button @click="startEditing" class="edit-btn">
              ✏️ Edit Profile
            </button>
            <button @click="showPasswordForm = true" class="password-btn">
              🔒 Change Password
            </button>
          </div>
        </div>

        <div v-else class="edit-mode">
          <form @submit.prevent="handleProfileUpdate" class="edit-form">
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input
                id="name"
                v-model="editData.name"
                type="text"
                class="form-input"
                :class="{ error: errors.name }"
                required
              />
              <span v-if="errors.name" class="field-error">{{
                errors.name
              }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="editData.email"
                type="email"
                class="form-input"
                :class="{ error: errors.email }"
                required
              />
              <span v-if="errors.email" class="field-error">{{
                errors.email
              }}</span>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                {{ isLoading ? "Saving..." : "Save Changes" }}
              </button>
              <button type="button" @click="cancelEditing" class="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Password Change Modal -->
    <div
      v-if="showPasswordForm"
      class="modal-overlay"
      @click="closePasswordForm"
    >
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Change Password</h3>
          <button @click="closePasswordForm" class="close-btn">×</button>
        </div>

        <form @submit.prevent="handlePasswordChange" class="password-form">
          <div class="form-group">
            <label for="currentPassword" class="form-label"
              >Current Password</label
            >
            <input
              id="currentPassword"
              v-model="passwordData.currentPassword"
              type="password"
              class="form-input"
              :class="{ error: passwordErrors.currentPassword }"
              required
            />
            <span v-if="passwordErrors.currentPassword" class="field-error">
              {{ passwordErrors.currentPassword }}
            </span>
          </div>

          <div class="form-group">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              id="newPassword"
              v-model="passwordData.newPassword"
              type="password"
              class="form-input"
              :class="{ error: passwordErrors.newPassword }"
              required
            />
            <span v-if="passwordErrors.newPassword" class="field-error">
              {{ passwordErrors.newPassword }}
            </span>
          </div>

          <div class="form-group">
            <label for="confirmNewPassword" class="form-label"
              >Confirm New Password</label
            >
            <input
              id="confirmNewPassword"
              v-model="passwordData.confirmNewPassword"
              type="password"
              class="form-input"
              :class="{ error: passwordErrors.confirmNewPassword }"
              required
            />
            <span v-if="passwordErrors.confirmNewPassword" class="field-error">
              {{ passwordErrors.confirmNewPassword }}
            </span>
          </div>

          <div class="modal-actions">
            <button
              type="submit"
              class="save-btn"
              :disabled="isPasswordLoading"
            >
              <span v-if="isPasswordLoading" class="spinner"></span>
              {{ isPasswordLoading ? "Updating..." : "Update Password" }}
            </button>
            <button type="button" @click="closePasswordForm" class="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, updateProfile, changePassword, isLoading } = useAuth();

// Component state
const isEditing = ref(false);
const showPasswordForm = ref(false);
const isPasswordLoading = ref(false);
const error = ref("");
const successMessage = ref("");
const fileInput = ref<HTMLInputElement>();

// Profile data
const profileData = ref({
  name: "",
  email: "",
  image_path: "",
  created_at: "",
});

const editData = ref({
  name: "",
  email: "",
});

const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

// Validation errors
const errors = ref<Record<string, string>>({});
const passwordErrors = ref<Record<string, string>>({});

// Initialize profile data from user
watch(
  user,
  (newUser) => {
    if (newUser) {
      profileData.value = {
        name: newUser.name || "",
        email: newUser.email || "",
        image_path: newUser.image_path || "",
        created_at: newUser.created_at || "",
      };
    }
  },
  { immediate: true }
);

// Helper functions
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Edit profile functions
const startEditing = () => {
  editData.value = {
    name: profileData.value.name,
    email: profileData.value.email,
  };
  errors.value = {};
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  editData.value = { name: "", email: "" };
  errors.value = {};
};

const validateProfileForm = () => {
  errors.value = {};

  if (!editData.value.name) {
    errors.value.name = "Name is required";
  } else if (editData.value.name.length < 2) {
    errors.value.name = "Name must be at least 2 characters";
  }

  if (!editData.value.email) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  return Object.keys(errors.value).length === 0;
};

const handleProfileUpdate = async () => {
  if (!validateProfileForm()) return;

  const result = await updateProfile(editData.value);

  if (result.success) {
    profileData.value.name = editData.value.name;
    profileData.value.email = editData.value.email;
    successMessage.value = "Profile updated successfully!";
    isEditing.value = false;

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } else {
    error.value = result.message || "Failed to update profile";
  }
};

// Image upload functions
const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type and size
  if (!file.type.startsWith("image/")) {
    error.value = "Please select a valid image file";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    error.value = "Image size must be less than 5MB";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const result = await updateProfile({ image: formData });

    if (result.success && result.data?.image_path) {
      profileData.value.image_path = result.data.image_path;
      successMessage.value = "Profile image updated successfully!";

      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    }
  } catch (err) {
    error.value = "Failed to upload image";
  }
};

// Password change functions
const closePasswordForm = () => {
  showPasswordForm.value = false;
  passwordData.value = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  passwordErrors.value = {};
};

const validatePasswordForm = () => {
  passwordErrors.value = {};

  if (!passwordData.value.currentPassword) {
    passwordErrors.value.currentPassword = "Current password is required";
  }

  if (!passwordData.value.newPassword) {
    passwordErrors.value.newPassword = "New password is required";
  } else if (passwordData.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = "Password must be at least 8 characters";
  }

  if (!passwordData.value.confirmNewPassword) {
    passwordErrors.value.confirmNewPassword =
      "Please confirm your new password";
  } else if (
    passwordData.value.newPassword !== passwordData.value.confirmNewPassword
  ) {
    passwordErrors.value.confirmNewPassword = "Passwords do not match";
  }

  return Object.keys(passwordErrors.value).length === 0;
};

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return;

  isPasswordLoading.value = true;

  const result = await changePassword({
    currentPassword: passwordData.value.currentPassword,
    newPassword: passwordData.value.newPassword,
  });

  isPasswordLoading.value = false;

  if (result.success) {
    successMessage.value = "Password changed successfully!";
    closePasswordForm();

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } else {
    passwordErrors.value.currentPassword =
      result.message || "Failed to change password";
  }
};

// Clear messages when component unmounts
onUnmounted(() => {
  error.value = "";
  successMessage.value = "";
});
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  border: 4px solid #e5e7eb;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.avatar-upload-btn:hover {
  background: #2563eb;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.profile-joined {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

.edit-btn,
.password-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.edit-btn:hover,
.password-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.edit-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.save-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.cancel-btn {
  background: white;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  border: 1px solid #feb2b2;
}

.success-message {
  background: #f0fff4;
  color: #22543d;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  border: 1px solid #9ae6b4;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.password-form .form-group {
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .form-actions,
  .modal-actions {
    flex-direction: column;
  }

  .profile-actions {
    justify-content: center;
  }
}
</style>
