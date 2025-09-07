<template>
  <div
    class="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100"
  >
    <AppNavigation />

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t bg-white/80 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-sm text-gray-600">
          &copy; 2024 InMyCity. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// This layout is for authentication pages
</script>
