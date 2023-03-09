<script setup>
import { ref, computed } from 'vue'
import { messages, completions } from '../api'

const message = ref('')

async function sendMessage() {
  const msg = message.value
  message.value = ''
  await completions(msg)
}

const showInput = computed({
  get() {
    console.log(messages.value[messages.value.length - 1])
    return messages.value.length === 0 || messages.value[messages.value.length - 1].role !== 'user'
  }
})
</script>

<template>
  <div class="chat-input" v-if="showInput">
    <textarea type="text" placeholder="说点啥..." rows="1" v-model="message" />
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