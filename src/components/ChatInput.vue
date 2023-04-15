<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { messages, completions, draw, drawing } from '../api'
import { role } from '../settings'

const message = ref('')
const emit = defineEmits()

async function sendMessage() {
  const msg = message.value
  message.value = ''
  const { exec } = role.value
  if (exec) {
    await eval(exec)(msg)
  } else {
    await completions(msg)
  }
}

const isThinking = computed({
  get() {
    return messages.value.length > 0 &&
      (drawing.value || _.last(messages.value).role === 'user' || _.last(messages.value).thinking)
  }
})
</script>

<template>
  <div class="chat-input">
    <input @keyup.enter="sendMessage" type="text" :placeholder="isThinking ? 'AI思考中...' : '说点啥...'" v-model="message" :disabled="isThinking" />
    <button @click="sendMessage" v-if="!isThinking">发送</button>
    <button @click="draw" v-if="!drawing && role.draw && messages.length > 0 && _.last(messages).role === 'assistant' && !_.last(messages).thinking">画图</button>
    <!-- <button @click="draw" v-if="!drawing">画图</button> -->
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>