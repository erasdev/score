<script setup lang="ts">
import Navigation from './components/Navigation.vue';
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 space-y-8">
    <navigation />
    <router-view></router-view>
  </div>

</template>
