<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="prose prose-lg mx-auto">
      <h1>Terms of Service</h1>

      <p>
        <strong>Last updated:</strong> {{ new Date().toLocaleDateString() }}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using this service, you accept and agree to be bound by
        the terms and provision of this agreement.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to temporarily download one copy of the materials
        on InMyCity for personal, non-commercial transitory viewing only.
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        The materials on InMyCity are provided on an 'as is' basis. InMyCity
        makes no warranties, expressed or implied, and hereby disclaims and
        negates all other warranties including without limitation, implied
        warranties or conditions of merchantability, fitness for a particular
        purpose, or non-infringement of intellectual property or other violation
        of rights.
      </p>

      <h2>4. Limitations</h2>
      <p>
        In no event shall InMyCity or its suppliers be liable for any damages
        (including, without limitation, damages for loss of data or profit, or
        due to business interruption) arising out of the use or inability to use
        the materials on InMyCity, even if InMyCity or an authorized
        representative has been notified orally or in writing of the possibility
        of such damage.
      </p>

      <h2>5. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact
        us.
      </p>

      <div class="mt-8">
        <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">
          ← Back to Registration
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Terms of Service",
});
</script>

<style scoped>
.prose {
  @apply text-foreground;
}

.prose h1 {
  @apply text-3xl font-bold mb-6 text-foreground;
}

.prose h2 {
  @apply text-xl font-semibold mt-8 mb-4 text-foreground;
}

.prose p {
  @apply mb-4 leading-relaxed;
}
</style>
