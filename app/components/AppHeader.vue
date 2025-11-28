<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const { user, logout } = useAuth();

const links: NavigationMenuItem[] = [{
  label: 'Discover',
  to: '/discover'
}]

async function handleLogout() {
  await logout();
  await navigateTo('/');
}
</script>

<template>
  <UHeader :links="links">
    <template #left>
      <NuxtLink to="/" class="text-xl font-bold text-highlighted">
        LensConnect
      </NuxtLink>
    </template>

    <template #right>
      <template v-if="user">
        <UButton label="Dashboard" color="neutral" to="/dashboard" />
        <UButton label="Logout" @click="handleLogout" />
      </template>
      <template v-else>
        <UButton label="Login" color="neutral" to="/login" />
        <UButton label="Sign Up" to="/register" />
      </template>
      <ColorModeButton />
    </template>
  </UHeader>
</template>
