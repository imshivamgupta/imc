<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <button @click="navigateToHome" class="btn btn-secondary back-btn">
          ← Back to Home
        </button>
        <h1>Posts</h1>
      </div>
      <div class="header-actions">
        <button @click="refresh()" :disabled="pending" class="btn btn-primary">
          {{ pending ? "Refreshing..." : "Refresh" }}
        </button>
      </div>
    </div>

    <!-- Posts List -->
    <div class="posts-section">
      <div v-if="pending" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>

      <div v-else-if="error" class="error">
        <h3>Failed to load posts</h3>
        <p>{{ error?.message || error || "An unexpected error occurred" }}</p>
        <button @click="refresh()" class="btn btn-primary retry-btn">
          Try Again
        </button>
      </div>

      <div v-else-if="!posts?.length" class="empty-state">
        <h3>No posts found</h3>
        <p>Unable to fetch posts from the API.</p>
      </div>

      <div v-else>
        <div class="posts-stats">
          <p>Total Posts: {{ posts?.length || 0 }}</p>
          <div class="filter-controls">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="search-input"
            />
            <select v-model="selectedUserId" class="user-filter">
              <option value="">All Users</option>
              <option
                v-for="userId in uniqueUserIds"
                :key="userId"
                :value="userId"
              >
                User {{ userId }}
              </option>
            </select>
          </div>
        </div>

        <div class="posts-grid">
          <div v-for="post in filteredPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <span class="post-id">#{{ post.id }}</span>
              <span class="user-badge">User {{ post.userId }}</span>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-body">{{ post.body }}</p>
            </div>
            <div class="post-actions">
              <button @click="viewPost(post)" class="btn btn-secondary">
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="loadPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="btn"
          >
            Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="loadPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <div v-if="selectedPost" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Post #{{ selectedPost.id }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="post-meta">
            <span class="user-info">By User {{ selectedPost.userId }}</span>
          </div>

          <h3 class="modal-title">{{ selectedPost.title }}</h3>
          <p class="modal-body-text">{{ selectedPost.body }}</p>

          <!-- Comments Section -->
          <div class="comments-section">
            <h4>Comments</h4>
            <div v-if="loadingComments" class="loading-comments">
              Loading comments...
            </div>
            <div v-else-if="comments?.length">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment"
              >
                <div class="comment-header">
                  <strong>{{ comment.name }}</strong>
                  <small>{{ comment.email }}</small>
                </div>
                <p class="comment-body">{{ comment.body }}</p>
              </div>
            </div>
            <div v-else class="no-comments">
              No comments available for this post.
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Set page metadata
useHead({
  title: "Posts - JSONPlaceholder",
});

// Global loader
const globalLoader = useGlobalLoader();

// Navigation with loader
const navigateToHome = async () => {
  globalLoader.showLoader("Loading Home...");
  await navigateTo("/");
};

// Reactive state
const selectedPost = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const loadingComments = ref(false);
const searchQuery = ref("");
const selectedUserId = ref("");
const currentPage = ref(1);
const postsPerPage = 12;

// Fetch posts from JSONPlaceholder
const {
  data: posts,
  pending,
  error,
  refresh,
} = await useLazyFetch<Post[]>("https://jsonplaceholder.typicode.com/posts", {
  key: "jsonplaceholder-posts",
  server: false, // Client-side only
  default: () => [],
  transform: (data: any) => {
    // Ensure we have an array of posts
    return Array.isArray(data) ? data : [];
  },
});

// Computed properties
const uniqueUserIds = computed(() => {
  if (!posts.value) return [];
  const userIds = [...new Set(posts.value.map((post) => post.userId))];
  return userIds.sort((a, b) => a - b);
});

const filteredPosts = computed(() => {
  if (!posts.value) return [];

  let filtered = posts.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    );
  }

  // Filter by user ID
  if (selectedUserId.value) {
    filtered = filtered.filter(
      (post) => post.userId === parseInt(selectedUserId.value)
    );
  }

  // Apply pagination
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;

  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  if (!posts.value) return 0;

  let filtered = posts.value;

  // Apply same filters as filteredPosts but without pagination
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    );
  }

  if (selectedUserId.value) {
    filtered = filtered.filter(
      (post) => post.userId === parseInt(selectedUserId.value)
    );
  }

  return Math.ceil(filtered.length / postsPerPage);
});

// Methods
const viewPost = async (post: Post) => {
  selectedPost.value = post;
  loadingComments.value = true;

  try {
    // Fetch comments for this post
    const fetchedComments = await $fetch<Comment[]>(
      `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
    );
    comments.value = fetchedComments || [];
  } catch (err) {
    console.error("Error fetching comments:", err);
    comments.value = [];
  } finally {
    loadingComments.value = false;
  }
};

const closeModal = () => {
  selectedPost.value = null;
  comments.value = [];
  loadingComments.value = false;
};

const loadPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Watch for filter changes to reset pagination
watch([searchQuery, selectedUserId], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.back-btn {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: #ef4444;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

.error h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
}

.retry-btn {
  margin-top: 1rem;
}

.empty-state {
  color: #6b7280;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.posts-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.posts-stats p {
  margin: 0;
  color: #6b7280;
  font-weight: 500;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input,
.user-filter {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.search-input {
  width: 200px;
}

.user-filter {
  min-width: 120px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-id {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.user-badge {
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-content {
  margin-bottom: 1rem;
}

.post-title {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  line-height: 1.4;
  text-transform: capitalize;
}

.post-body {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
}

.post-actions .btn {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-weight: 500;
  color: #374151;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.post-meta {
  margin-bottom: 1rem;
}

.user-info {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-title {
  margin: 0 0 1rem 0;
  color: #1f2937;
  text-transform: capitalize;
  line-height: 1.4;
}

.modal-body-text {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.comments-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.comments-section h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.loading-comments {
  text-align: center;
  color: #6b7280;
  padding: 1rem;
}

.comment {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.comment:last-child {
  margin-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.comment-header strong {
  color: #1f2937;
  text-transform: capitalize;
}

.comment-header small {
  color: #6b7280;
  font-size: 0.75rem;
}

.comment-body {
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.no-comments {
  text-align: center;
  color: #9ca3af;
  padding: 1rem;
  font-style: italic;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: white;
}

@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .posts-stats {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
