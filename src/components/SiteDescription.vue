<script setup lang="ts">
import { ref, onMounted } from 'vue';
import fetchSiteConfig, {type SiteConfig } from '../helpers/fetchSiteConfig';
onMounted(async () => {
    siteConfig.value = await fetchSiteConfig();
});

const siteConfig = ref<SiteConfig>({
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  background: '#ffffff',
  surface: '#ffffff',
  text: '#1f2937',
  accent: '#4f46e5'
});
</script>
<template>
    <div class="px-4 sm:px-6 lg:px-8 mb-6">
      <p class="text-lg text-gray-600">{{ siteConfig.description }}</p>
    </div>
</template>