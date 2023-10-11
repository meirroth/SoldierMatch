<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <MatchForm />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'SoldierMatch',
  meta: [
    { name: 'robots', content: 'noindex' }
  ],
})
</script>
