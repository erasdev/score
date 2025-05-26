<script setup lang="ts">
import SiteDescription from './SiteDescription.vue';
import DynamicFiltersTemplate from './DynamicFiltersTemplate.vue';
import DynamicPdfListTemplate from './DynamicPdfListTemplate.vue';
import fetchSiteConfig from '../helpers/fetchSiteConfig';
import { ref, onMounted } from 'vue';
import type { SiteConfig } from '../helpers/fetchSiteConfig';

const loading = ref(true);

const siteConfig = ref<SiteConfig|null>(null);

onMounted(async () => {
    siteConfig.value = await fetchSiteConfig();
    loading.value = false;
});
</script>

<template>
  <div v-if="!loading" class="py-8">
    <SiteDescription> {{ siteConfig?.description }} </SiteDescription>
    <DynamicFiltersTemplate />
    <DynamicPdfListTemplate />
  </div>
</template>
