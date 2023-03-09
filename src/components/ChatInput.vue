<script setup>
import { ref, computed } from 'vue'
import { messages, completions } from '../api'

const message = ref('')
const emit = defineEmits()

async function sendMessage() {
  emit('SEND')
  const msg = message.value
  message.value = ''
  await completions(msg)
}

const showInput = computed({
  get() {
    return messages.value.length === 0 ||
      messages.value[messages.value.length - 1].role !== 'user' &&
      !messages.value[messages.value.length - 1].thinking
  }
})
</script>

<template>
  <div class="chat-input" v-if="showInput">
    <input type="text" placeholder="说点啥..." v-model="message" />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>