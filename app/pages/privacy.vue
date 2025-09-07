<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="prose prose-lg mx-auto">
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> {{ new Date().toLocaleDateString() }}
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you
        create an account, update your profile, or contact us for support.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices and support messages</li>
        <li>Communicate with you about products, services, and events</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information
        to third parties without your consent, except as described in this
        policy.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal
        information against unauthorized access, alteration, disclosure, or
        destruction.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Delete your account and personal information</li>
        <li>Object to processing of your information</li>
      </ul>

      <h2>6. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us.
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
  title: "Privacy Policy",
});
</script>

<style scoped>
.prose {
  @apply text-gray-800;
}

.prose h1 {
  @apply text-3xl font-bold mb-6 text-gray-900;
}

.prose h2 {
  @apply text-xl font-semibold mt-8 mb-4 text-gray-900;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul {
  @apply list-disc list-inside mb-4 space-y-2;
}

.prose li {
  @apply leading-relaxed;
}
</style>
