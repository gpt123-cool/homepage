<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { NSpace, NCard } from 'naive-ui'
import Markdown from 'vue3-markdown-it'

import ChatInput from '../components/ChatInput.vue'
import { thinking, messages, chat } from '../api/openai'

const el = ref(null)
const scrollToBottom = _.throttle(() => { if (el.value) el.value.scrollTop = el.value.scrollHeight }, 20)
watch(() => _.last(messages.value)?.content, scrollToBottom)
</script>

<template>
  <div class="page">
    <!-- <div class="role">
      abc
    </div> -->
    <div class="messages" ref="el">
      <n-space vertical>
        <n-card v-for="message in messages" :key="message.id" bordered size="small">
          <markdown :source="message.content"></markdown>
        </n-card>
      </n-space>
    </div>
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