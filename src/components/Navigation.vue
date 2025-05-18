<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SiteConfig } from '../types/site';

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

onMounted(async () => {
  try {
    const res = await fetch('/site-config.json');
    const data = await res.json();
    const localConfig = loadLocalConfig();
    
    if (localConfig && data) {
      const hostedTimestamp = new Date(data._lastModified || 0).getTime();
      const localTimestamp = new Date(localConfig._lastModified || 0).getTime();

      // If hosted version is newer, remove from localStorage
      if (hostedTimestamp > localTimestamp) {
        localStorage.removeItem('draft:site-config');
        siteConfig.value = data;
      } else {
        // Use local version
        siteConfig.value = localConfig;
      }
    } else {
      siteConfig.value = localConfig || data;
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
    </div>
</template>