<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - LensConnect',
  description: 'The marketplace for photographers and clients.',
  ogTitle: 'LensConnect - The Photography Marketplace',
  ogDescription: 'Find the best photographers for your events, or find new clients for your photography business.',
  ogImage: 'https://example.com/og-image.png', // To be replaced later
  twitterImage: 'https://example.com/og-image.png', // To be replaced later
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
    <UToaster />
  </UApp>
</template>
