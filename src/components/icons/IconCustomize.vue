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
    <rect x="2" y="2" width="8" height="8" rx="2"></rect>
    <rect x="14" y="2" width="8" height="8" rx="2"></rect>
    <rect x="2" y="14" width="8" height="8" rx="2"></rect>
    <rect x="14" y="14" width="8" height="8" rx="2"></rect>
    <path d="M7 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
    <path d="M19 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
    <path d="M6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
    <path d="M19 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
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
