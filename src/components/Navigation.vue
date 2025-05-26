<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SiteConfig } from '../helpers/fetchSiteConfig';
import fetchSiteConfig from '../helpers/fetchSiteConfig';

const siteConfig = ref<SiteConfig|null>(null);


onMounted(async () => {
  siteConfig.value = await fetchSiteConfig();
});

</script>

<template>
    <div class="flex justify-between mx-auto w-full items-center">
      <router-link to="/">
        <div class="flex items-center gap-2">
            <img src="../assets/dog.svg" alt="Logo" class="size-16 md:size-25" />
            <span class="text-2xl font-semibold tracking-tight text-text-dark md:text-4xl">{{ siteConfig?.title }}</span>
        </div>
      </router-link>

    </div>
</template>