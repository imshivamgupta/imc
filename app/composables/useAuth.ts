interface User {
  id: number;
  name: string;
  email: string;
  image_path?: string;
  created_at?: string;
  email_verified?: boolean;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: User;
    token?: string;
    image_path?: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  image?: FormData;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Global state
const user = ref<User | null>(null);
const token = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string>("");

export const useAuth = () => {
  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value);

  // Initialize auth state on client side
  const initAuth = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        try {
          token.value = storedToken;
          user.value = JSON.parse(storedUser);
        } catch {
          // Clear invalid stored data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
    }
  };

  // Store auth data
  const setAuthData = (authToken: string, userData: User) => {
    token.value = authToken;
    user.value = userData;

    if (import.meta.client) {
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }
  };

  // Clear auth data
  const clearAuthData = () => {
    token.value = null;
    user.value = null;

    if (import.meta.client) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  };

  // Register
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = "";

      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });

      if (response && typeof response === "object" && "success" in response) {
        const authData = response as {
          success: boolean;
          data?: { token?: string; user?: User };
          message?: string;
        };
        if (authData.success && authData.data?.token && authData.data?.user) {
          setAuthData(authData.data.token, authData.data.user);
          await navigateTo("/profile");
        }
        return { success: true, message: authData.message };
      }

      return { success: false, message: "Registration failed" };
    } catch (err) {
      const errorMsg =
        (err as { data?: { message?: string } }).data?.message ||
        "Registration failed";
      error.value = errorMsg;
      return { success: false, message: errorMsg };
    } finally {
      isLoading.value = false;
    }
  };

  // Login
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = "";

      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      if (response && typeof response === "object" && "success" in response) {
        const authData = response as {
          success: boolean;
          data?: { token?: string; user?: User };
          message?: string;
        };
        if (authData.success && authData.data?.token && authData.data?.user) {
          setAuthData(authData.data.token, authData.data.user);
          await navigateTo("/profile");
        }
        return { success: true, message: authData.message };
      }

      return { success: false, message: "Login failed" };
    } catch (err) {
      const errorMsg =
        (err as { data?: { message?: string } }).data?.message ||
        "Login failed";
      error.value = errorMsg;
      return { success: false, message: errorMsg };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async (): Promise<AuthResponse> => {
    try {
      isLoading.value = true;

      if (token.value) {
        await $fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
      }
    } catch {
      // Continue with logout even if API call fails
    } finally {
      clearAuthData();
      isLoading.value = false;
      await navigateTo("/auth/login");
    }

    return { success: true };
  };

  // Update profile
  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = "";

      const headers: Record<string, string> = {};
      let body: FormData | Record<string, string>;

      if (data.image) {
        body = data.image;
      } else {
        body = { name: data.name || "", email: data.email || "" };
        headers["Content-Type"] = "application/json";
      }

      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`;
      }

      const response = await $fetch("/api/auth/profile", {
        method: "PUT",
        body,
        headers,
      });

      if (response && typeof response === "object" && "success" in response) {
        const profileData = response as {
          success: boolean;
          data?: { user?: User };
          message?: string;
        };
        if (profileData.success && profileData.data?.user) {
          user.value = profileData.data.user;
          if (import.meta.client) {
            localStorage.setItem(
              "auth_user",
              JSON.stringify(profileData.data.user)
            );
          }
        }
        return {
          success: true,
          message: profileData.message,
          data: profileData.data,
        };
      }

      return { success: false, message: "Profile update failed" };
    } catch (err) {
      const errorMsg =
        (err as { data?: { message?: string } }).data?.message ||
        "Profile update failed";
      error.value = errorMsg;
      return { success: false, message: errorMsg };
    } finally {
      isLoading.value = false;
    }
  };

  // Change password
  const changePassword = async (
    data: ChangePasswordData
  ): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = "";

      const response = await $fetch("/api/auth/change-password", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response && typeof response === "object" && "success" in response) {
        const passwordData = response as { success: boolean; message?: string };
        return { success: true, message: passwordData.message };
      }

      return { success: false, message: "Password change failed" };
    } catch (err) {
      const errorMsg =
        (err as { data?: { message?: string } }).data?.message ||
        "Password change failed";
      error.value = errorMsg;
      return { success: false, message: errorMsg };
    } finally {
      isLoading.value = false;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!token.value) return;

    try {
      const response = await $fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response && typeof response === "object" && "success" in response) {
        const userData = response as {
          success: boolean;
          data?: { user?: User };
        };
        if (userData.success && userData.data?.user) {
          user.value = userData.data.user;
          if (import.meta.client) {
            localStorage.setItem(
              "auth_user",
              JSON.stringify(userData.data.user)
            );
          }
        }
      }
    } catch {
      // If token is invalid, clear auth data
      clearAuthData();
    }
  };

  // Initialize on first load
  if (import.meta.client && !user.value) {
    initAuth();
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,

    // Methods
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    initAuth,
    clearAuthData,
  };
};
