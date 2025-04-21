<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22l-4-10-10-4z"></path>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 24
  }
})
</script>
