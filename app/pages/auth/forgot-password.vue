<template>
  <div class="auth-page">
    <div class="reset-form">
      <form @submit.prevent="handleSubmit" class="form">
        <h2 class="form-title">Reset Password</h2>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            :class="{ error: emailError }"
            placeholder="Enter your email address"
            required
          />
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
          <p class="field-help">
            We'll send you a link to reset your password.
          </p>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? "Sending..." : "Send Reset Link" }}
        </button>

        <div class="form-links">
          <NuxtLink to="/auth/login" class="link">
            Remember your password? Sign in
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

// Component state
const email = ref("");
const error = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const emailError = ref("");

// Computed
const isFormValid = computed(() => {
  return email.value && validateEmail(email.value) && !emailError.value;
});

// Validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = () => {
  emailError.value = "";

  if (!email.value) {
    emailError.value = "Email is required";
    return false;
  }

  if (!validateEmail(email.value)) {
    emailError.value = "Please enter a valid email address";
    return false;
  }

  return true;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const response = await $fetch("/api/auth/password-reset-request", {
      method: "POST",
      body: { email: email.value },
    });

    successMessage.value =
      response.message || "Password reset link sent to your email!";
    email.value = "";
  } catch (err: any) {
    error.value =
      err.data?.message || "Failed to send reset link. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Clear errors when user types
watch(email, () => {
  if (emailError.value || error.value) {
    emailError.value = "";
    error.value = "";
  }
});
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

.reset-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #feb2b2;
}

.success-message {
  background: #f0fff4;
  color: #22543d;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #9ae6b4;
}

.form-group {
  margin-bottom: 1.5rem;
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

.field-help {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.submit-button {
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: #2563eb;
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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

.form-links {
  margin-top: 1.5rem;
  text-align: center;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.link:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>
