<script setup>
import { ref } from 'vue'
import { completions } from '../api'

const message = ref('')
async function sendMessage() {
  await completions(message.value)
}
</script>

<template>
  <div class="chat-input">
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