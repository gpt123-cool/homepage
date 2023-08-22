<script setup>
import { NSpace, NCard } from 'naive-ui'
import Markdown from 'vue3-markdown-it'

import ChatInput from '../components/ChatInput.vue'
import { thinking, messages, chat } from '../api/openai'
</script>

<template>
  <div class="page">
    <!-- <div class="role">
      abc
    </div> -->
    <n-space class="messages" vertical>
      <n-card v-for="message in messages" :key="message.id" bordered size="small">
        <markdown :source="message.content"></markdown>
      </n-card>
    </n-space>
    <chat-input :disabled="thinking" @send="chat" />
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;

  .messages {
    flex: 1;
    margin-bottom: 10px;
    overflow-y: auto;
  }
}
</style>