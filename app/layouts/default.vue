<template>
  <div class="app-layout">
    <AppNavigation />
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
