<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { SiteConfig } from '../types/site';
import LocalStorageBanner from './LocalStorageBanner.vue';

const siteConfig = ref<SiteConfig>({
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#1f2937',
    accent: '#4f46e5'
  }
});

const hasLocalChanges = computed(() => {
  return !!localStorage.getItem('draft:site-config');
});

onMounted(async () => {
  try {
    const res = await fetch('/site-config.json');
    const data = await res.json();
    const localConfig = loadLocalConfig();
    
    if (localConfig) {
      siteConfig.value = localConfig;
    } else {
      siteConfig.value = data;
    }
  } catch (error) {
    console.error('Failed to load site configuration:', error);
  }
});

function loadLocalConfig(): SiteConfig | null {
  const localConfig = localStorage.getItem('draft:site-config');
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch {
      return null;
    }
  }
  return null;
}
</script>

<template>
    <div class="flex justify-between items-center pl-6">
        <div class="flex items-center gap-2">
            <img src="../assets/dog.svg" alt="Logo" class="size-16 md:size-25" />
            <span class="text-2xl font-semibold tracking-tight text-gray-800 md:text-4xl">{{ siteConfig.title }}</span>
        </div>
        <LocalStorageBanner 
          :has-local-changes="hasLocalChanges" 
        />
    </div>
</template>