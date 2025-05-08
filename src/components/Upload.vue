<script setup lang="ts">
import { ref } from 'vue'
import netlifyIdentity from 'netlify-identity-widget'

netlifyIdentity.init()

const title = ref('')
const description = ref('')
const tags = ref('')
const file = ref(null)
const successMessage = ref('')

const onFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleSubmit = async () => {
  const user = netlifyIdentity.currentUser()
  if (!user) {
    netlifyIdentity.open()
    return
  }

  const token = user.token.access_token

  const fileName = `${Date.now()}-${file.value.name}`
  const filePath = `static/uploads/${fileName}`

  // Step 1: Upload the PDF to the repo
  const fileContent = await file.value.arrayBuffer()
  const fileBase64 = btoa(
    new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )

  const uploadRes = await fetch(`https://api.github.com/repos/<your-user>/<your-repo>/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload PDF: ${fileName}`,
      content: fileBase64,
    }),
  })

  if (!uploadRes.ok) {
    alert('Failed to upload file')
    return
  }

  // Step 2: Create the markdown file
  const metadata = `---
title: "${title.value}"
description: "${description.value}"
file: "/uploads/${fileName}"
tags: [${tags.value.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
---`

  const slug = title.value.toLowerCase().replace(/\s+/g, '-')
  const contentPath = `content/pdfs/${slug}.md`
  const metadataBase64 = btoa(unescape(encodeURIComponent(metadata)))

  const commitRes = await fetch(`https://api.github.com/repos/<your-user>/<your-repo>/contents/${contentPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add PDF metadata: ${slug}`,
      content: metadataBase64,
    }),
  })

  if (commitRes.ok) {
    successMessage.value = 'Upload complete!'
    title.value = description.value = tags.value = ''
    file.value = null
  } else {
    alert('Failed to create metadata file')
  }
}
</script>


<template>
    <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 class="text-xl font-bold mb-4">Upload PDF</h1>
  
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input v-model="title" placeholder="Title" required class="w-full border p-2 rounded" />
        <textarea v-model="description" placeholder="Description" class="w-full border p-2 rounded" rows="3" />
        <input v-model="tags" placeholder="Tags (comma-separated)" class="w-full border p-2 rounded" />
        <input type="file" accept="application/pdf" @change="onFileChange" required />
  
        <button class="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Upload
        </button>
      </form>
  
      <p class="text-green-600 mt-4" v-if="successMessage">{{ successMessage }}</p>
    </div>
  </template>
  
