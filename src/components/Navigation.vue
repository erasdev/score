<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SiteConfig } from '../helpers/fetchSiteConfig';
import fetchSiteConfig from '../helpers/fetchSiteConfig';

const siteConfig = ref<SiteConfig>({
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  background: '#ffffff',
  surface: '#ffffff',
  text: '#1f2937',
  accent: '#4f46e5'
});


onMounted(async () => {
  siteConfig.value = await fetchSiteConfig();
});

</script>

<template>
    <div class="flex justify-between mx-auto w-full items-center pl-6">
      <router-link to="/">
        <div class="flex items-center gap-2">
            <img src="../assets/dog.svg" alt="Logo" class="size-16 md:size-25" />
            <span class="text-2xl font-semibold tracking-tight text-gray-800 md:text-4xl">{{ siteConfig.title }}</span>
        </div>
      </router-link>

    </div>
</template>