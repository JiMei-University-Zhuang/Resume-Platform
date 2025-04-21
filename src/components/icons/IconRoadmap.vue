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
    <path d="M3 3v18h18"></path>
    <path d="M7 12h4l2-4 4 8 3-4h4"></path>
    <path d="M7 17v-5.3"></path>
    <path d="M11.2 17v-5"></path>
    <path d="m15.3 17-.2-1.8"></path>
    <path d="M19.2 17v-1.9"></path>
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
