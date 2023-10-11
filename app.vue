<template>
  <div class="min-h-screen flex items-center justify-center bg-green-50">
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
