<script setup lang="ts">
useSeoMeta({
  title: 'LensConnect - The Photography Marketplace',
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Find Your Perfect Photographer"
      description="The world's leading marketplace for photographers and clients. Book your next photoshoot with confidence."
    >
      <template #links>
        <UButton
          label="Book Now"
          to="/discover"
          size="xl"
        />
      </template>
    </UPageHero>

    <UPageSection>
      <h2 class="text-2xl font-bold text-center">
        Featured Categories
      </h2>
      <!-- Categorized gallery will go here -->
    </UPageSection>
  </UPage>
</template>
