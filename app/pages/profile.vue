<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p class="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <!-- Profile Information Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Profile Avatar and Basic Info -->
            <div class="flex flex-col md:flex-row gap-6 items-start">
              <!-- Avatar Section -->
              <div class="flex-shrink-0">
                <div class="relative">
                  <Avatar class="h-24 w-24">
                    <AvatarImage
                      v-if="user?.image_path"
                      :src="user.image_path"
                      :alt="user.name"
                    />
                    <AvatarFallback
                      class="text-xl bg-primary text-primary-foreground"
                    >
                      {{ getUserInitials() }}
                    </AvatarFallback>
                  </Avatar>

                  <Button
                    @click="triggerFileUpload"
                    size="sm"
                    variant="outline"
                    class="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  >
                    <Camera class="h-4 w-4" />
                  </Button>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                </div>
              </div>

              <!-- Profile Form -->
              <div class="flex-1 space-y-4">
                <form @submit.prevent="handleProfileUpdate" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Name Field -->
                    <div class="space-y-2">
                      <Label for="name">Full Name</Label>
                      <Input
                        id="name"
                        v-model="profileForm.name"
                        placeholder="Enter your full name"
                        :disabled="!isEditingProfile"
                        :class="{ 'border-red-500': errors.name }"
                      />
                      <span v-if="errors.name" class="text-sm text-red-500">
                        {{ errors.name }}
                      </span>
                    </div>

                    <!-- Email Field (Read-only) -->
                    <div class="space-y-2">
                      <Label for="email">Email Address</Label>
                      <Input
                        id="email"
                        :value="user?.email"
                        placeholder="Your email address"
                        disabled
                        class="bg-gray-50"
                      />
                      <p class="text-xs text-gray-500">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-3">
                    <Button
                      v-if="!isEditingProfile"
                      type="button"
                      @click="startEditingProfile"
                      variant="outline"
                    >
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>

                    <template v-else>
                      <Button type="submit" :disabled="isUpdatingProfile">
                        <Loader2
                          v-if="isUpdatingProfile"
                          class="mr-2 h-4 w-4 animate-spin"
                        />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        @click="cancelEditingProfile"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </template>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Change Password Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Lock class="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handlePasswordChange" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Current Password -->
                <div class="space-y-2">
                  <Label for="currentPassword">Current Password</Label>
                  <div class="relative">
                    <Input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      placeholder="Enter current password"
                      :class="{
                        'border-red-500': passwordErrors.currentPassword,
                      }"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      class="absolute right-0 top-0 h-full px-3"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <Eye v-if="!showCurrentPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                  <span
                    v-if="passwordErrors.currentPassword"
                    class="text-sm text-red-500"
                  >
                    {{ passwordErrors.currentPassword }}
                  </span>
                </div>

                <!-- New Password -->
                <div class="space-y-2">
                  <Label for="newPassword">New Password</Label>
                  <div class="relative">
                    <Input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Enter new password"
                      :class="{ 'border-red-500': passwordErrors.newPassword }"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      class="absolute right-0 top-0 h-full px-3"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <Eye v-if="!showNewPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                  <span
                    v-if="passwordErrors.newPassword"
                    class="text-sm text-red-500"
                  >
                    {{ passwordErrors.newPassword }}
                  </span>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-2">
                  <Label for="confirmPassword">Confirm New Password</Label>
                  <div class="relative">
                    <Input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm new password"
                      :class="{
                        'border-red-500': passwordErrors.confirmPassword,
                      }"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      class="absolute right-0 top-0 h-full px-3"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                  <span
                    v-if="passwordErrors.confirmPassword"
                    class="text-sm text-red-500"
                  >
                    {{ passwordErrors.confirmPassword }}
                  </span>
                </div>
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="passwordForm.newPassword" class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Password strength:</span>
                  <div
                    class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full transition-all duration-300"
                      :class="passwordStrength.colorClass"
                      :style="{ width: passwordStrength.percentage + '%' }"
                    ></div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="passwordStrength.textColorClass"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">
                  Password should be at least 8 characters with uppercase,
                  lowercase, and numbers
                </p>
              </div>

              <!-- Password Change Button -->
              <Button
                type="submit"
                :disabled="isChangingPassword"
                class="w-full md:w-auto"
              >
                <Loader2
                  v-if="isChangingPassword"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Account Information Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Info class="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="text-sm font-medium text-gray-500"
                  >Member Since</Label
                >
                <p class="text-sm text-gray-900">
                  {{ user?.created_at ? formatDate(user.created_at) : "N/A" }}
                </p>
              </div>
              <div>
                <Label class="text-sm font-medium text-gray-500"
                  >Account Status</Label
                >
                <div class="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    class="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Success/Error Messages -->
        <Alert v-if="successMessage" class="border-green-200 bg-green-50">
          <CheckCircle class="h-4 w-4 text-green-600" />
          <AlertDescription class="text-green-800">
            {{ successMessage }}
          </AlertDescription>
        </Alert>

        <Alert v-if="errorMessage" variant="destructive">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import {
  User,
  Lock,
  Info,
  Edit,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-vue-next";

// Page meta
definePageMeta({
  middleware: "auth",
});

// Auth composable
const { user, updateProfile, changePassword, refreshUser } = useAuth();

// Refs for file upload
const fileInput = ref<HTMLInputElement | null>(null);

// Profile editing state
const isEditingProfile = ref(false);
const isUpdatingProfile = ref(false);

// Password change state
const isChangingPassword = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Profile form
const profileForm = reactive({
  name: user.value?.name || "",
});

// Password form
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Error states
const errors = reactive({
  name: "",
});

const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Messages
const successMessage = ref("");
const errorMessage = ref("");

// Initialize profile form when user data is available
watch(
  user,
  (newUser) => {
    if (newUser) {
      profileForm.name = newUser.name || "";
    }
  },
  { immediate: true }
);

// Helper functions
const getUserInitials = () => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((n) => n.charAt(0))
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

// Profile editing functions
const startEditingProfile = () => {
  isEditingProfile.value = true;
  profileForm.name = user.value?.name || "";
  errors.name = "";
};

const cancelEditingProfile = () => {
  isEditingProfile.value = false;
  profileForm.name = user.value?.name || "";
  errors.name = "";
};

const validateProfileForm = () => {
  let isValid = true;

  // Reset errors
  errors.name = "";

  // Validate name
  if (!profileForm.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  } else if (profileForm.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
    isValid = false;
  }

  return isValid;
};

const handleProfileUpdate = async () => {
  if (!validateProfileForm()) return;

  isUpdatingProfile.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await updateProfile({
      name: profileForm.name.trim(),
    });

    successMessage.value = "Profile updated successfully!";
    isEditingProfile.value = false;

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to update profile";
  } finally {
    isUpdatingProfile.value = false;
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

  // Validate file type
  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Please select a valid image file";
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "Image size must be less than 5MB";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await $fetch<{
      success: boolean;
      message?: string;
      data?: { image_path: string };
    }>("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (response.success && response.data?.image_path) {
      // Refresh user data to get the updated profile
      await refreshUser();

      successMessage.value = "Profile picture updated successfully!";

      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = "";
      }, 5000);
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to upload image";
  }

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Password change functions
const validatePasswordForm = () => {
  let isValid = true;

  // Reset errors
  passwordErrors.currentPassword = "";
  passwordErrors.newPassword = "";
  passwordErrors.confirmPassword = "";

  // Validate current password
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = "Current password is required";
    isValid = false;
  }

  // Validate new password
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = "New password is required";
    isValid = false;
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = "Password must be at least 8 characters";
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
    passwordErrors.newPassword =
      "Password must contain uppercase, lowercase, and numbers";
    isValid = false;
  }

  // Validate confirm password
  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = "Please confirm your new password";
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  return isValid;
};

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return;

  isChangingPassword.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    successMessage.value = "Password changed successfully!";

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to change password";
  } finally {
    isChangingPassword.value = false;
  }
};

// Password strength calculation
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword;
  if (!password)
    return { percentage: 0, label: "", colorClass: "", textColorClass: "" };

  let score = 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 12,
  ];

  score = checks.filter(Boolean).length;

  if (score <= 2) {
    return {
      percentage: 20,
      label: "Weak",
      colorClass: "bg-red-500",
      textColorClass: "text-red-600",
    };
  } else if (score <= 4) {
    return {
      percentage: 60,
      label: "Medium",
      colorClass: "bg-yellow-500",
      textColorClass: "text-yellow-600",
    };
  } else {
    return {
      percentage: 100,
      label: "Strong",
      colorClass: "bg-green-500",
      textColorClass: "text-green-600",
    };
  }
});

// Clear messages when component unmounts
onUnmounted(() => {
  successMessage.value = "";
  errorMessage.value = "";
});
</script>
