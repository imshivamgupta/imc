<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" />
      <span class="ml-2 text-muted-foreground">Loading page...</span>
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive" class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error Loading Page</AlertTitle>
      <AlertDescription>
        {{ error.message || "Failed to load the page for editing." }}
      </AlertDescription>
    </Alert>

    <!-- Edit Form -->
    <div v-else-if="page">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Edit Page</h1>
          <p class="text-muted-foreground mt-2">
            Make changes to "{{ page.title }}"
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="goBack">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button @click="previewPage" variant="secondary">
            <Eye class="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <!-- Form -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Edit class="h-5 w-5" />
            Edit Page Details
          </CardTitle>
          <CardDescription>
            Update the information below. The slug cannot be changed after
            creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updatePage" class="space-y-6">
            <!-- Slug and Title -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="slug">Slug (URL)</Label>
                <Input id="slug" :value="page.slug" disabled class="bg-muted" />
                <p class="text-sm text-muted-foreground">
                  URL: /pages/{{ page.slug }}
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
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <Label for="content">Page Content *</Label>
              <textarea
                id="content"
                v-model="pageForm.content"
                class="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your page content here..."
                required
              ></textarea>
            </div>

            <!-- Visibility Settings -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-base">Visibility Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="is_public"
                    v-model:checked="pageForm.is_public"
                  />
                  <Label for="is_public" class="text-sm font-normal">
                    Make this page publicly visible
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

            <!-- Changes Summary -->
            <Card v-if="hasChanges">
              <CardHeader class="pb-3">
                <CardTitle class="text-base text-amber-600">
                  Pending Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul class="space-y-2 text-sm">
                  <li
                    v-if="pageForm.title !== page.title"
                    class="flex items-center gap-2"
                  >
                    <Badge variant="outline" class="text-xs">Title</Badge>
                    {{ page.title }} → {{ pageForm.title }}
                  </li>
                  <li
                    v-if="pageForm.description !== (page.description || '')"
                    class="flex items-center gap-2"
                  >
                    <Badge variant="outline" class="text-xs">Description</Badge>
                    {{ page.description || "(empty)" }} →
                    {{ pageForm.description || "(empty)" }}
                  </li>
                  <li
                    v-if="pageForm.content !== page.content"
                    class="flex items-center gap-2"
                  >
                    <Badge variant="outline" class="text-xs">Content</Badge>
                    Content has been modified
                  </li>
                  <li
                    v-if="pageForm.is_public !== page.is_public"
                    class="flex items-center gap-2"
                  >
                    <Badge variant="outline" class="text-xs">Visibility</Badge>
                    {{ page.is_public ? "Public" : "Private" }} →
                    {{ pageForm.is_public ? "Public" : "Private" }}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <Button
                type="submit"
                :disabled="!hasChanges || isSubmitting"
                class="flex-1 md:flex-none"
              >
                <Loader2
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                <Save v-else class="mr-2 h-4 w-4" />
                {{ isSubmitting ? "Saving..." : "Save Changes" }}
              </Button>

              <Button
                type="button"
                variant="outline"
                @click="resetForm"
                :disabled="!hasChanges || isSubmitting"
              >
                <RotateCcw class="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Preview Dialog -->
    <Dialog v-model:open="showPreview">
      <DialogContent class="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{{ pageForm.title || "Page Preview" }}</DialogTitle>
          <DialogDescription>
            This is how your page will look after saving
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
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
import { Badge } from "@/components/ui/badge";
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
  Edit,
  AlertCircle,
  Save,
  RotateCcw,
  Eye,
  Loader2,
} from "lucide-vue-next";

// Router and auth
const router = useRouter();
const route = useRoute();
const { token } = useAuth();

// State
const isSubmitting = ref(false);
const showPreview = ref(false);

// Get the slug from the route
const slug = computed(() => route.params.slug);

// Fetch page data for editing
const {
  data: pageResponse,
  pending,
  error,
  refresh,
} = await useFetch(`/api/pages/${slug.value}`, {
  headers: computed(() => ({
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
  })),
  server: false, // Disable SSR for this fetch to avoid hydration issues
});

// Extract the actual page data from the API response
const page = computed(() => pageResponse.value?.data || null);

// Form data
const pageForm = ref({
  title: "",
  content: "",
  description: "",
  is_public: false,
});

// Initialize form when page data is loaded
watch(
  page,
  (newPage) => {
    if (newPage) {
      pageForm.value = {
        title: newPage.title || "",
        content: newPage.content || "",
        description: newPage.description || "",
        is_public: newPage.is_public || false,
      };
    }
  },
  { immediate: true }
);

// Check if form has changes
const hasChanges = computed(() => {
  if (!page.value) return false;

  return (
    pageForm.value.title !== page.value.title ||
    pageForm.value.content !== page.value.content ||
    pageForm.value.description !== (page.value.description || "") ||
    pageForm.value.is_public !== page.value.is_public
  );
});

// Functions
const updatePage = async () => {
  if (!page.value || !hasChanges.value) return;

  isSubmitting.value = true;

  try {
    // Only send changed fields
    const updateData = {};

    if (pageForm.value.title !== page.value.title) {
      updateData.title = pageForm.value.title;
    }

    if (pageForm.value.content !== page.value.content) {
      updateData.content = pageForm.value.content;
    }

    if (pageForm.value.description !== (page.value.description || "")) {
      updateData.description = pageForm.value.description;
    }

    if (pageForm.value.is_public !== page.value.is_public) {
      updateData.is_public = pageForm.value.is_public;
    }

    const response = await $fetch(`/api/pages/${slug.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(updateData),
    });

    if (response.success) {
      // Navigate back to the page view
      await navigateTo(`/pages/${slug.value}`);
    } else {
      throw new Error(response.error || "Failed to update page");
    }
  } catch (error) {
    console.error("Error updating page:", error);
    alert("Failed to update page: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  if (page.value) {
    pageForm.value = {
      title: page.value.title || "",
      content: page.value.content || "",
      description: page.value.description || "",
      is_public: page.value.is_public || false,
    };
  }
};

const previewPage = () => {
  showPreview.value = true;
};

const goBack = () => {
  if (hasChanges.value) {
    if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
      router.back();
    }
  } else {
    router.back();
  }
};

// Meta
useHead({
  title: () => `Edit: ${page.value?.title || "Page"}`,
  meta: [{ name: "description", content: "Edit page content and settings" }],
});

// Warn before leaving if there are unsaved changes
onBeforeUnmount(() => {
  if (hasChanges.value) {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }
});
</script>

<style scoped>
.prose {
  max-width: none;
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1.2em;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  margin-top: 2em;
  margin-bottom: 0.8em;
  font-weight: 600;
  line-height: 1.2;
}
</style>
