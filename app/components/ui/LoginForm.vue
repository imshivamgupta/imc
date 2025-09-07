<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" class="form">
      <h2 class="form-title">{{ title }}</h2>

      <div v-if="authError" class="error-message">
        {{ authError }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ error: errors.email }"
          placeholder="Enter your email"
          required
        />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          class="form-input"
          :class="{ error: errors.password }"
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          class="password-toggle"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? "👁️" : "🙈" }}
        </button>
        <span v-if="errors.password" class="field-error">{{
          errors.password
        }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox-container">
          <input v-model="rememberMe" type="checkbox" class="checkbox" />
          <span class="checkmark"></span>
          Remember me
        </label>
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? "Signing in..." : "Sign In" }}
      </button>

      <div class="form-links">
        <NuxtLink to="/auth/forgot-password" class="link">
          Forgot your password?
        </NuxtLink>
        <NuxtLink to="/auth/register" class="link">
          Don't have an account? Sign up
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  redirectTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Sign In",
  redirectTo: "/profile",
});

const { login, isLoading, error: authError } = useAuth();

// Form state
const formData = ref({
  email: "",
  password: "",
});

const rememberMe = ref(false);
const showPassword = ref(false);
const errors = ref<Record<string, string>>({});
const successMessage = ref("");

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.email &&
    formData.value.password &&
    Object.keys(errors.value).length === 0
  );
});

// Validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = () => {
  errors.value = {};

  if (!formData.value.email) {
    errors.value.email = "Email is required";
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!formData.value.password) {
    errors.value.password = "Password is required";
  } else if (formData.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  }

  return Object.keys(errors.value).length === 0;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await login(formData.value);

  if (result.success) {
    successMessage.value = result.message || "Login successful!";
    // Auth composable handles redirect
  }
};

// Watch for auth errors
watch(authError, (newError) => {
  if (newError) {
    errors.value = {};
  }
});

// Clear errors when user types
watch(
  formData,
  () => {
    if (Object.keys(errors.value).length > 0) {
      errors.value = {};
    }
    if (authError.value) {
      // Clear auth error when user starts typing
    }
  },
  { deep: true }
);
</script>

<style scoped>
.login-form {
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
  position: relative;
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

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 2.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}

.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox {
  margin-right: 0.5rem;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
