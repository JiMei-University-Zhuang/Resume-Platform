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
    <path
      d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 2 17.5v-11a2.5 2.5 0 0 1 2.5-2.5h.5"
    ></path>
    <path
      d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 22 17.5v-11a2.5 2.5 0 0 0-2.5-2.5h-.5"
    ></path>
    <path d="M12 2a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"></path>
    <path d="M12 17a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5z"></path>
    <path d="M12 18.5v-13"></path>
    <path d="M7 10h4"></path>
    <path d="M13 10h4"></path>
    <path d="M17 14h-4"></path>
    <path d="M11 14H7"></path>
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
