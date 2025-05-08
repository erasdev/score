<script setup lang="ts">
import { onMounted } from 'vue'
import netlifyIdentity from 'netlify-identity-widget'

onMounted(() => {
  // Initialize Netlify Identity
  netlifyIdentity.init()
  
  // Initialize Netlify CMS
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) {
        window.netlifyIdentity.on('login', () => {
          document.location.href = '/admin/'
        })
      }
    })
  }
})
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
    <h1 class="text-xl font-bold mb-4">Upload PDF</h1>
    <p class="mb-4">Please log in to access the CMS:</p>
    <button 
      @click="netlifyIdentity.open()" 
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Log in
    </button>
  </div>
</template>
  
