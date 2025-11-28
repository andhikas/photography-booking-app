<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth();
</script>

<template>
  <UPage>
    <UPageHeader
      title="Dashboard"
      :description="`Welcome back, ${user?.email}`"
    />
    <UPageBody>
      <p>This is a protected page.</p>
      <p>Your role is: {{ user?.role }}</p>
    </UPageBody>
  </UPage>
</template>
