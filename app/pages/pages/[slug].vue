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
        {{
          error.message ||
          "Failed to load the page. It may not exist or you may not have permission to view it."
        }}
      </AlertDescription>
    </Alert>

    <!-- Page Content -->
    <div v-else-if="page" class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <Badge v-if="!page.is_public" variant="secondary">
              <Lock class="h-3 w-3 mr-1" />
              Private
            </Badge>
            <Badge v-else variant="outline">
              <Globe class="h-3 w-3 mr-1" />
              Public
            </Badge>
          </div>

          <h1 class="text-4xl font-bold tracking-tight mb-2">
            {{ page.title }}
          </h1>

          <p v-if="page.description" class="text-xl text-muted-foreground mb-4">
            {{ page.description }}
          </p>

          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              {{ page.owner_name || "Unknown" }}
            </div>
            <div v-if="page.created_at" class="flex items-center gap-1">
              <Calendar class="h-4 w-4" />
              {{ formatDate(page.created_at) }}
            </div>
            <div
              v-if="page.updated_at && page.updated_at !== page.created_at"
              class="flex items-center gap-1"
            >
              <Clock class="h-4 w-4" />
              Updated {{ formatDate(page.updated_at) }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button variant="outline" size="sm" @click="goBack">
            <ArrowLeft class="h-4 w-4 mr-1" />
            Back
          </Button>

          <DropdownMenu v-if="page.can_edit">
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="editPage">
                <Edit class="h-4 w-4 mr-2" />
                Edit Page
              </DropdownMenuItem>
              <DropdownMenuItem @click="toggleVisibility">
                <Eye class="h-4 w-4 mr-2" />
                {{ page.is_public ? "Make Private" : "Make Public" }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="confirmDelete" class="text-red-600">
                <Trash2 class="h-4 w-4 mr-2" />
                Delete Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button v-if="page.can_edit" @click="editPage" size="sm">
            <Edit class="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      <Separator />

      <!-- Page Content -->
      <Card>
        <CardContent class="p-8">
          <div class="prose prose-lg max-w-none">
            <div
              v-if="page.content"
              class="whitespace-pre-wrap leading-relaxed"
            >
              {{ page.content }}
            </div>
            <div v-else class="text-muted-foreground italic text-center py-8">
              No content available for this page.
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Page Info Footer -->
      <Card>
        <CardContent class="p-4">
          <div
            class="flex items-center justify-between text-sm text-muted-foreground"
          >
            <div class="flex items-center gap-4">
              <span>Page ID: {{ page.id || "N/A" }}</span>
              <span>Slug: {{ page.slug || "N/A" }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm" @click="copyPageUrl">
                <Copy class="h-4 w-4 mr-1" />
                Copy URL
              </Button>
              <Button variant="ghost" size="sm" @click="shareePage">
                <Share class="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Page</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{{ page?.title || "this page" }}"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deletePage"
            class="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Globe,
  Lock,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Copy,
  Share,
  Loader2,
  AlertCircle,
} from "lucide-vue-next";

// Router
const router = useRouter();
const route = useRoute();

// Auth
const { token } = useAuth();

// State
const showDeleteDialog = ref(false);

// Get the slug from the route
const slug = computed(() => route.params.slug);

// Debug logging
console.log("🔍 Page component initialized");
console.log("📝 Slug from route:", slug.value);
console.log("🔑 Token available:", !!token.value);
console.log("🔗 Token value (first 20 chars):", token.value?.substring(0, 20));

// Fetch page data
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
  onRequest({ request, options }) {
    console.log("📡 Making request to:", request);
    console.log("🔧 Request options:", options);
  },
  onResponse({ response }) {
    console.log("📨 Response status:", response.status);
    console.log("📊 Response data:", response._data);
  },
  onResponseError({ error }) {
    console.log("❌ Response error:", error);
  },
});

// Extract the actual page data from the API response
const page = computed(() => pageResponse.value?.data || null);

// Watch for data changes
watch(
  [pageResponse, page, pending, error],
  ([newResponse, newPage, newPending, newError]) => {
    console.log("🔄 Data changed:");
    console.log("📦 Raw response:", newResponse);
    console.log("📄 Extracted page data:", newPage);
    console.log("⏳ Pending:", newPending);
    console.log("🚨 Error:", newError);
  },
  { immediate: true }
);

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

const goBack = () => {
  router.back();
};

const editPage = () => {
  if (!page.value?.slug) {
    alert("Page data not available");
    return;
  }
  router.push(`/edit-page/${page.value.slug}`);
};

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const deletePage = async () => {
  if (!page.value?.slug) {
    alert("Page data not available");
    return;
  }

  try {
    await $fetch(`/api/pages/${page.value.slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    showDeleteDialog.value = false;
    router.push("/pages-test");
  } catch (error) {
    console.error("Error deleting page:", error);
    alert("Failed to delete page: " + error.message);
  }
};

const toggleVisibility = async () => {
  if (!page.value?.slug) {
    alert("Page data not available");
    return;
  }

  try {
    await $fetch(`/api/pages/${page.value.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        is_public: !page.value.is_public,
      }),
    });

    // Refresh the page data
    await refresh();
  } catch (error) {
    console.error("Error updating page visibility:", error);
    alert("Failed to update page visibility: " + error.message);
  }
};

const copyPageUrl = async () => {
  if (!page.value?.slug) {
    alert("Page data not available");
    return;
  }

  if (typeof window === "undefined") return; // SSR check

  const url = `${window.location.origin}/pages/${page.value.slug}`;
  try {
    await navigator.clipboard.writeText(url);
    // You can add a toast notification here
    alert("Page URL copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy URL:", error);
    alert("Failed to copy URL");
  }
};

const shareePage = () => {
  if (!page.value?.slug) {
    alert("Page data not available");
    return;
  }

  if (typeof window === "undefined") return; // SSR check

  const url = `${window.location.origin}/pages/${page.value.slug}`;
  if (navigator.share) {
    navigator.share({
      title: page.value.title || "Shared Page",
      text: page.value.description || page.value.title || "Check out this page",
      url: url,
    });
  } else {
    copyPageUrl();
  }
};

// Meta
useHead({
  title: () => page.value?.title || "Page",
  meta: [
    {
      name: "description",
      content: () => page.value?.description || "View page content",
    },
  ],
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

.prose h1 {
  font-size: 1.75em;
}

.prose h2 {
  font-size: 1.5em;
}

.prose h3 {
  font-size: 1.25em;
}

.prose ul,
.prose ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.prose li {
  margin: 0.5em 0;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1.5em 0;
  font-style: italic;
  color: #6b7280;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.875em;
}
</style>
