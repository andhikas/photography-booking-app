<script setup lang="ts">
const categories = ['all', 'Wedding', 'Product', 'Event', 'Pre-wedding'];

const filters = reactive({
  category: 'all',
  location: '',
  minPrice: null,
  maxPrice: null,
});

const { data: photographers, pending, refresh } = await useLazyFetch('/api/photographers', {
  query: filters,
  watch: [], // Only refresh manually
});

function applyFilters() {
  refresh();
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Discover Photographers"
      description="Find the perfect photographer for your needs."
    />
    <UPageBody>
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <USelectMenu
          v-model="filters.category"
          :items="categories"
          placeholder="Category"
          class="w-full md:w-48"
        />
        <UInput v-model="filters.location" placeholder="Location" class="w-full md:w-48" />
        <UInput v-model.number="filters.minPrice" type="number" placeholder="Min Price" class="w-full md:w-32" />
        <UInput v-model.number="filters.maxPrice" type="number" placeholder="Max Price" class="w-full md:w-32" />
        <UButton @click="applyFilters" label="Filter" />
      </div>

      <div v-if="pending">
        <p>Loading...</p>
      </div>
      <div v-else-if="photographers && photographers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- PhotographerCard will go here -->
        <UCard v-for="p in photographers" :key="p.id">
            <template #header>
                <h3 class="font-bold">{{ p.name }}</h3>
            </template>

            <img :src="p.profile_picture" alt="" class="w-full h-48 object-cover rounded-md">

            <p class="mt-2 text-sm text-muted">{{ p.location }}</p>
            <p class="mt-1 text-sm">{{ p.bio }}</p>

            <template #footer>
                <div class="flex justify-between items-center">
                    <UBadge :label="p.category" />
                    <p class="font-semibold">${{ p.hourly_rate }}/hr</p>
                </div>
            </template>
        </UCard>
      </div>
      <div v-else>
        <p>No photographers found matching your criteria.</p>
      </div>
    </UPageBody>
  </UPage>
</template>
