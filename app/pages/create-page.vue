<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Create New Page</h1>
        <p class="text-muted-foreground mt-2">
          Design and publish your unique page with a custom URL
        </p>
      </div>
      <Button variant="outline" @click="navigateToPages">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Pages
      </Button>
    </div>

    <!-- Authentication Alert -->
    <Alert v-if="!isAuthenticated" class="mb-6" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription>
        You must be logged in to create pages. Please
        <NuxtLink to="/auth/login" class="underline font-medium"
          >login</NuxtLink
        >
        or
        <NuxtLink to="/auth/register" class="underline font-medium"
          >register</NuxtLink
        >
        first.
      </AlertDescription>
    </Alert>

    <!-- Main Form -->
    <Card v-else class="w-full">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          Page Details
        </CardTitle>
        <CardDescription>
          Fill in the information below to create your new page. The slug will
          be used in the URL.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <form @submit.prevent="createPage" class="space-y-6">
          <!-- Slug and Title Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="slug">Page Slug *</Label>
              <Input
                id="slug"
                v-model="pageForm.slug"
                placeholder="my-awesome-page"
                @input="validateSlug"
                :class="{ 'border-red-500': slugError }"
                required
              />
              <p class="text-sm text-muted-foreground">
                URL: {{ baseUrl }}/pages/{{ pageForm.slug || "your-slug" }}
              </p>
              <p v-if="slugError" class="text-sm text-red-500">
                {{ slugError }}
              </p>
              <p v-if="slugAvailable === false" class="text-sm text-red-500">
                This slug is already taken
              </p>
              <p v-if="slugAvailable === true" class="text-sm text-green-500">
                This slug is available
              </p>
            </div>

            <div class="space-y-2">
              <Label for="title">Page Title *</Label>
              <Input
                id="title"
                v-model="pageForm.title"
                placeholder="My Awesome Page"
                required
              />
              <p class="text-sm text-muted-foreground">
                This will be displayed as the page heading
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Input
              id="description"
              v-model="pageForm.description"
              placeholder="A brief description of your page (optional)"
            />
            <p class="text-sm text-muted-foreground">
              This will be shown in page listings and search results
            </p>
          </div>

          <!-- Content -->
          <div class="space-y-2">
            <Label for="content">Page Content *</Label>
            <textarea
              id="content"
              v-model="pageForm.content"
              class="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write your page content here. You can use markdown or plain text..."
              required
            ></textarea>
            <p class="text-sm text-muted-foreground">
              The main content of your page. Markdown formatting is supported.
            </p>
          </div>

          <!-- Visibility Settings -->
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-base">Visibility Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center space-x-2">
                <Checkbox id="is_public" v-model:checked="pageForm.is_public" />
                <Label
                  for="is_public"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this page public
                </Label>
              </div>
              <p class="text-sm text-muted-foreground mt-2">
                {{
                  pageForm.is_public
                    ? "Anyone can view this page"
                    : "Only you can view this page"
                }}
              </p>
            </CardContent>
          </Card>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <Button
              type="submit"
              :disabled="!canSubmit || isSubmitting"
              class="flex-1 md:flex-none"
            >
              <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              <Plus v-else class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Creating..." : "Create Page" }}
            </Button>

            <Button
              type="button"
              variant="outline"
              @click="resetForm"
              :disabled="isSubmitting"
            >
              <RotateCcw class="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              type="button"
              variant="secondary"
              @click="previewPage"
              :disabled="!pageForm.content.trim()"
            >
              <Eye class="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Preview Dialog -->
    <Dialog v-model:open="showPreview">
      <DialogContent class="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{{ pageForm.title || "Page Preview" }}</DialogTitle>
          <DialogDescription>
            This is how your page will look when published
          </DialogDescription>
        </DialogHeader>

        <div class="mt-4 space-y-4">
          <div v-if="pageForm.description" class="text-muted-foreground italic">
            {{ pageForm.description }}
          </div>

          <Separator />

          <div class="prose prose-sm max-w-none">
            <div class="whitespace-pre-wrap">{{ pageForm.content }}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showPreview = false">
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Plus,
  RotateCcw,
  Eye,
  Loader2,
} from "lucide-vue-next";

// Composables
const router = useRouter();
const { isAuthenticated } = useAuth();

// Base URL for preview
const baseUrl = "http://localhost:3000";

// Form data
const pageForm = ref({
  slug: "",
  title: "",
  content: "",
  description: "",
  is_public: true,
});

// UI state
const isSubmitting = ref(false);
const showPreview = ref(false);
const slugError = ref("");
const slugAvailable = ref(null);
const slugCheckTimeout = ref(null);

// Computed
const canSubmit = computed(() => {
  return (
    pageForm.value.slug &&
    pageForm.value.title &&
    pageForm.value.content.trim() &&
    !slugError.value &&
    slugAvailable.value !== false
  );
});

// Slug validation
const validateSlug = () => {
  const slug = pageForm.value.slug;

  if (!slug) {
    slugError.value = "";
    slugAvailable.value = null;
    return;
  }

  // Check format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    slugError.value =
      "Slug must contain only lowercase letters, numbers, and hyphens";
    slugAvailable.value = null;
    return;
  }

  if (slug.length > 255) {
    slugError.value = "Slug must be less than 255 characters";
    slugAvailable.value = null;
    return;
  }

  slugError.value = "";

  // Debounced availability check
  clearTimeout(slugCheckTimeout.value);
  slugCheckTimeout.value = setTimeout(async () => {
    await checkSlugAvailability(slug);
  }, 500);
};

// API functions
const checkSlugAvailability = async (slug) => {
  try {
    const response = await $fetch(`/api/pages/${slug}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    // If we get a response, the slug exists
    slugAvailable.value = false;
  } catch (error) {
    // If we get a 404, the slug is available
    if (error.status === 404) {
      slugAvailable.value = true;
    } else {
      slugAvailable.value = null;
    }
  }
};

const getToken = async () => {
  // This should get the token from your auth composable
  // Adjust based on your auth implementation
  return localStorage.getItem("auth_token") || "";
};

const createPage = async () => {
  if (!canSubmit.value) return;

  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(pageForm.value),
    });

    if (response.success) {
      // Show success message
      await navigateTo(`/pages/${pageForm.value.slug}`);
    } else {
      throw new Error(response.error || "Failed to create page");
    }
  } catch (error) {
    console.error("Error creating page:", error);
    // You can add toast notification here
    alert("Failed to create page: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  pageForm.value = {
    slug: "",
    title: "",
    content: "",
    description: "",
    is_public: true,
  };
  slugError.value = "";
  slugAvailable.value = null;
};

const previewPage = () => {
  showPreview.value = true;
};

const navigateToPages = () => {
  router.push("/pages-test");
};

// Auto-generate slug from title
watch(
  () => pageForm.value.title,
  (newTitle) => {
    if (!pageForm.value.slug && newTitle) {
      pageForm.value.slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }
  }
);

// Meta
useHead({
  title: "Create New Page",
  meta: [
    {
      name: "description",
      content: "Create a new page with custom content and unique URL",
    },
  ],
});
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1em;
}

.prose h1,
.prose h2,
.prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}
</style>
