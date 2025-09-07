<template>
  <div
    class="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center space-x-2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white"
          >
            <span class="text-lg font-bold">CA</span>
          </div>
          <span class="text-2xl font-bold text-gray-900">City App</span>
        </NuxtLink>
      </div>

      <!-- Register Form Card -->
      <Card class="shadow-lg">
        <CardHeader class="text-center space-y-2">
          <CardTitle class="text-2xl font-bold">Create Your Account</CardTitle>
          <p class="text-gray-600">Join us to explore your city</p>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Error Display -->
            <Alert v-if="authError" variant="destructive">
              <AlertCircle class="h-4 w-4" />
              <AlertDescription>{{ authError }}</AlertDescription>
            </Alert>

            <!-- Success Display -->
            <Alert
              v-if="successMessage"
              class="border-green-200 bg-green-50 text-green-800"
            >
              <CheckCircle class="h-4 w-4" />
              <AlertDescription>{{ successMessage }}</AlertDescription>
            </Alert>

            <!-- Full Name Field -->
            <div class="space-y-2">
              <Label for="name">Full Name</Label>
              <div class="relative">
                <Input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Enter your full name"
                  class="pl-10"
                  :class="{
                    'border-red-500 focus:border-red-500': errors.name,
                  }"
                  required
                />
                <User
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
              </div>
              <span v-if="errors.name" class="text-sm text-red-600">{{
                errors.name
              }}</span>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <div class="relative">
                <Input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="Enter your email"
                  class="pl-10"
                  :class="{
                    'border-red-500 focus:border-red-500': errors.email,
                  }"
                  required
                />
                <Mail
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
              </div>
              <span v-if="errors.email" class="text-sm text-red-600">{{
                errors.email
              }}</span>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="pl-10 pr-10"
                  :class="{
                    'border-red-500 focus:border-red-500': errors.password,
                  }"
                  required
                />
                <Lock
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
              </div>
              <span v-if="errors.password" class="text-sm text-red-600">{{
                errors.password
              }}</span>

              <!-- Password Strength Indicator -->
              <div v-if="formData.password" class="space-y-2">
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="passwordStrength.class"
                    :style="{ width: passwordStrength.percentage + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-600">{{
                  passwordStrength.text
                }}</span>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-2">
              <Label for="confirmPassword">Confirm Password</Label>
              <div class="relative">
                <Input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="pl-10 pr-10"
                  :class="{
                    'border-red-500 focus:border-red-500':
                      errors.confirmPassword,
                  }"
                  required
                />
                <Lock
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
              </div>
              <span
                v-if="errors.confirmPassword"
                class="text-sm text-red-600"
                >{{ errors.confirmPassword }}</span
              >
            </div>

            <!-- Terms & Conditions -->
            <div class="space-y-2">
              <div class="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  v-model="acceptTerms"
                  class="mt-1 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  :class="{ 'border-red-500': errors.acceptTerms }"
                />
                <Label for="terms" class="text-sm leading-5">
                  I agree to the
                  <NuxtLink
                    to="/terms"
                    class="text-violet-600 hover:text-violet-700"
                    target="_blank"
                  >
                    Terms of Service
                  </NuxtLink>
                  and
                  <NuxtLink
                    to="/privacy"
                    class="text-violet-600 hover:text-violet-700"
                    target="_blank"
                  >
                    Privacy Policy
                  </NuxtLink>
                </Label>
              </div>
              <span v-if="errors.acceptTerms" class="text-sm text-red-600">{{
                errors.acceptTerms
              }}</span>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              class="w-full bg-violet-600 hover:bg-violet-700"
              :disabled="isLoading || !isFormValid"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? "Creating Account..." : "Create Account" }}
            </Button>

            <!-- Debug Info (remove in production) -->
            <div v-if="true" class="text-xs text-gray-500 space-y-1">
              <div>Form Valid: {{ isFormValid }}</div>
              <div>Name: {{ formData.name.trim() !== "" }}</div>
              <div>
                Email: {{ formData.email.trim() !== "" }} &
                {{ validateEmail(formData.email) }}
              </div>
              <div>
                Password: {{ formData.password !== "" }} &
                {{ formData.password.length >= 8 }}
              </div>
              <div>Confirm: {{ formData.confirmPassword !== "" }}</div>
              <div>
                Match: {{ formData.password === formData.confirmPassword }}
              </div>
              <div>
                Terms: {{ acceptTerms }} (type: {{ typeof acceptTerms }})
              </div>
              <div>Errors: {{ Object.keys(errors).length }}</div>
            </div>

            <!-- Divider -->
            <Separator class="my-6" />

            <!-- Sign In Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <NuxtLink
                  to="/auth/login"
                  class="text-violet-600 hover:text-violet-700 font-medium"
                >
                  Sign in
                </NuxtLink>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/"
          class="text-sm text-gray-600 hover:text-gray-700 inline-flex items-center"
        >
          <ArrowLeft class="mr-1 h-4 w-4" />
          Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});

// Handle redirect parameter
const route = useRoute();
const redirectTo = (route.query.redirect as string) || "/profile";

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
  // Check if all required fields are filled
  const hasRequiredFields =
    formData.value.name.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.password !== "" &&
    formData.value.confirmPassword !== "" &&
    acceptTerms.value;

  // Check if passwords match
  const passwordsMatch =
    formData.value.password === formData.value.confirmPassword;

  // Check if email is valid
  const emailValid = validateEmail(formData.value.email);

  // Check if password is strong enough (at least 8 characters)
  const passwordValid = formData.value.password.length >= 8;

  // Check if name is long enough
  const nameValid = formData.value.name.trim().length >= 2;

  // Return true only if all conditions are met and no errors exist
  return (
    hasRequiredFields &&
    passwordsMatch &&
    emailValid &&
    passwordValid &&
    nameValid &&
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
    className = "bg-red-500";
  } else if (score < 75) {
    text = "Fair";
    className = "bg-yellow-500";
  } else if (score < 100) {
    text = "Good";
    className = "bg-blue-500";
  } else {
    text = "Strong";
    className = "bg-green-500";
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
    confirmPassword: formData.value.confirmPassword,
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
