<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <Alert v-if="error" variant="destructive">
              <AlertCircle class="h-4 w-4" />
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <Alert v-if="successMessage" class="border-green-200 bg-green-50">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <AlertDescription class="text-green-800">{{
                successMessage
              }}</AlertDescription>
            </Alert>

            <div class="space-y-2">
              <Label for="email">Email Address</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email address"
                  class="pl-10"
                  :class="{ 'border-red-500': emailError }"
                  required
                />
              </div>
              <p v-if="emailError" class="text-sm text-red-500">
                {{ emailError }}
              </p>
            </div>

            <Button
              type="submit"
              class="w-full"
              :disabled="isLoading || !isFormValid"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? "Sending..." : "Send Reset Link" }}
            </Button>
          </form>
        </CardContent>
        <CardFooter class="text-center">
          <div class="text-sm text-muted-foreground">
            Remember your password?
            <NuxtLink
              to="/auth/login"
              class="text-primary hover:underline ml-1"
            >
              Sign in
            </NuxtLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, CheckCircle, Mail, Loader2 } from "lucide-vue-next";

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
    const response: any = await $fetch("/api/auth/password-reset-request", {
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
