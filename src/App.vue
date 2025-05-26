<script setup lang="ts">
import Navigation from './components/Navigation.vue';
</script>

<template>
  <div class="min-h-screen bg-background">
  <div class="max-w-6xl mx-auto p-4 py-8 space-y-8">
    <navigation/>
    <div>
      <router-view></router-view>
    </div>
  </div>
  </div>


</template>
