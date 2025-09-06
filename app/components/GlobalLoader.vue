<template>
  <div class="global-loader-overlay">
    <div class="loader-container">
      <div class="spinner"></div>
      <p v-if="message" class="loader-message">{{ message }}</p>
      <p v-else class="loader-message">Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

defineProps<Props>();
</script>

<style scoped>
.global-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-in-out;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-message {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
