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
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.5 11a3.5 3.5 0 1 0-7 0"></path>
    <path
      d="M12 2a7 7 0 0 1 7 7c0 2.5-2 5-3 6s-2 2-2 4h-4c0-2-1-3-2-4s-3-3.5-3-6a7 7 0 0 1 7-7Z"
    ></path>
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
