<script setup>
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import { drawing, custom } from '../api/midjourney'

defineProps({
  message_id: String,
  up: Object
})

const active = ref(false)

async function handelClick(message_id, { custom_id, style }) {
  if (style !== 1 && !active.value) {
    await custom(message_id, custom_id)
    active.value = true
  }
}

function getType(up) {
  if (up.style === 1 || active.value) return 'info'
}
</script>

<template>
<n-button :disabled="drawing" @click="() => handelClick(message_id, up)" :type="getType(up)">{{ up.label || up.emoji.name }}</n-button>
</template>

<style scoped>
button {
  font-family: monospace;
  font-size: large;
  margin-bottom: 10px;
}
</style>