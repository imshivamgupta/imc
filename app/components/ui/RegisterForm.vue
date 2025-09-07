<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="form">
      <h2 class="form-title">{{ title }}</h2>

      <div v-if="authError" class="error-message">
        {{ authError }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="form-group">
        <label for="name" class="form-label">Full Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ error: errors.name }"
          placeholder="Enter your full name"
          required
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
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

        <!-- Password strength indicator -->
        <div v-if="formData.password" class="password-strength">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :class="passwordStrength.class"
              :style="{ width: passwordStrength.percentage + '%' }"
            ></div>
          </div>
          <span class="strength-text">{{ passwordStrength.text }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          class="form-input"
          :class="{ error: errors.confirmPassword }"
          placeholder="Confirm your password"
          required
        />
        <button
          type="button"
          class="password-toggle"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          {{ showConfirmPassword ? "👁️" : "🙈" }}
        </button>
        <span v-if="errors.confirmPassword" class="field-error">{{
          errors.confirmPassword
        }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox-container">
          <input
            v-model="acceptTerms"
            type="checkbox"
            class="checkbox"
            required
          />
          <span class="checkmark"></span>
          I agree to the
          <NuxtLink to="/terms" class="inline-link" target="_blank"
            >Terms of Service</NuxtLink
          >
          and
          <NuxtLink to="/privacy" class="inline-link" target="_blank"
            >Privacy Policy</NuxtLink
          >
        </label>
        <span v-if="errors.acceptTerms" class="field-error">{{
          errors.acceptTerms
        }}</span>
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? "Creating Account..." : "Create Account" }}
      </button>

      <div class="form-links">
        <NuxtLink to="/auth/login" class="link">
          Already have an account? Sign in
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
  title: "Create Account",
  redirectTo: "/profile",
});

const { register, isLoading, error: authError } = useAuth();

// Form state
const formData = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const errors = ref<Record<string, string>>({});
const successMessage = ref("");

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword &&
    acceptTerms.value &&
    Object.keys(errors.value).length === 0
  );
});

const passwordStrength = computed(() => {
  const password = formData.value.password;
  if (!password) return { percentage: 0, text: "", class: "" };

  let score = 0;
  let feedback = [];

  // Length check
  if (password.length >= 8) score += 25;
  else feedback.push("at least 8 characters");

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25;
  else feedback.push("uppercase letter");

  // Lowercase check
  if (/[a-z]/.test(password)) score += 25;
  else feedback.push("lowercase letter");

  // Number or special character check
  if (/[\d\W]/.test(password)) score += 25;
  else feedback.push("number or special character");

  let text = "";
  let className = "";

  if (score < 50) {
    text = "Weak";
    className = "weak";
  } else if (score < 75) {
    text = "Fair";
    className = "fair";
  } else if (score < 100) {
    text = "Good";
    className = "good";
  } else {
    text = "Strong";
    className = "strong";
  }

  if (feedback.length > 0) {
    text += ` (needs: ${feedback.join(", ")})`;
  }

  return { percentage: score, text, class: className };
});

// Validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = () => {
  errors.value = {};

  if (!formData.value.name) {
    errors.value.name = "Full name is required";
  } else if (formData.value.name.length < 2) {
    errors.value.name = "Name must be at least 2 characters";
  }

  if (!formData.value.email) {
    errors.value.email = "Email is required";
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!formData.value.password) {
    errors.value.password = "Password is required";
  } else if (formData.value.password.length < 8) {
    errors.value.password = "Password must be at least 8 characters";
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password";
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
  }

  if (!acceptTerms.value) {
    errors.value.acceptTerms = "You must accept the terms and conditions";
  }

  return Object.keys(errors.value).length === 0;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await register({
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
  });

  if (result.success) {
    successMessage.value = result.message || "Account created successfully!";
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
  },
  { deep: true }
);

watch(acceptTerms, () => {
  if (errors.value.acceptTerms) {
    delete errors.value.acceptTerms;
  }
});
</script>

<style scoped>
.register-form {
  max-width: 450px;
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-fill.weak {
  background: #dc2626;
}
.strength-fill.fair {
  background: #f59e0b;
}
.strength-fill.good {
  background: #10b981;
}
.strength-fill.strong {
  background: #059669;
}

.strength-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.checkbox {
  margin-right: 0.5rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.inline-link {
  color: #3b82f6;
  text-decoration: none;
}

.inline-link:hover {
  text-decoration: underline;
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
