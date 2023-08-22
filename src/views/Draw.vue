<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { NSpace } from 'naive-ui'
import { messages, draw, drawing } from '../api/midjourney'

import ChatInput from '../components/ChatInput.vue'

const el = ref(null)
const scrollToBottom = _.throttle(() => { if (el.value) el.value.scrollTop = el.value.scrollHeight }, 20)
watch(() => _.last(messages.value)?.content, scrollToBottom)
</script>

<template>
  <div class="page">
    <div class="messages" ref="el">
      <n-space vertical size="large">
        <div v-for="{ origin, img, content, components } of messages" class="message">
          <div v-if="origin">{{ origin }}</div>
          <div>{{ content }}</div>
          <img v-if="img?.url" :src="img.url" @load="scrollToBottom" />
          <!-- {{ components }} -->
        </div>
      </n-space>
    </div>
    <chat-input :disabled="drawing" @send="draw" />
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
    font-size: 17px;

    .message {
      border-radius: 10px;
      background-color: #35373a;
      padding: 10px;

      img {
        max-width: 100%;
        margin-top: 10px 0;
      }
    }
  }
}
</style>