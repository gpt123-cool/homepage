<script setup>
import { ref } from 'vue'
import { drawing, upscale, makeVariation } from '../api'

defineProps({
  up: Object
})

const active = ref(false)

async function handelClick(u) {
  if (u.style !== 1 && !active.value) {
    drawing.value = true

    try {
      const fn = u.label?.startsWith('U') ? upscale : makeVariation
      await fn(u)
      active.value = true
    } finally {
      drawing.value = false
    }
  }
}
</script>

<template>
<button :disabled="drawing" @click="() => handelClick(up)" :class="{ active: up.style === 1 || active }">{{ up.label || up.emoji.name }}</button>
</template>

<style scoped>
.active {
  background-color: rgb(88, 101, 242);
  color: white;
}

button {
  font-family: monospace;
  font-size: large;
}

button:disabled {
  color: #475569;
}
</style>