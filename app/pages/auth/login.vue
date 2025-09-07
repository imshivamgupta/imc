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

      <!-- Login Form Card -->
      <Card class="shadow-lg">
        <CardHeader class="text-center space-y-2">
          <CardTitle class="text-2xl font-bold">Welcome Back</CardTitle>
          <p class="text-gray-600">Sign in to explore your city</p>
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
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox id="remember" v-model:checked="rememberMe" />
                <Label for="remember" class="text-sm">Remember me</Label>
              </div>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-sm text-violet-600 hover:text-violet-700"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              class="w-full bg-violet-600 hover:bg-violet-700"
              :disabled="isLoading || !isFormValid"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? "Signing in..." : "Sign In" }}
            </Button>

            <!-- Divider -->
            <Separator class="my-6" />

            <!-- Sign Up Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <NuxtLink
                  to="/auth/register"
                  class="text-violet-600 hover:text-violet-700 font-medium"
                >
                  Sign up
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
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-vue-next";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

// Handle redirect parameter
const route = useRoute();
const redirectTo = (route.query.redirect as string) || "/profile";

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
