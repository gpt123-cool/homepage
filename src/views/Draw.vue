<script setup>
import { NSpace } from 'naive-ui'
import { messages, draw, drawing } from '../api/midjourney'

import ChatInput from '../components/ChatInput.vue'

</script>

<template>
  <div class="page">
    <div class="messages">
      <n-space vertical size="large">
        <div v-for="{ origin, img, content, components } of messages" class="message">
          <div v-if="origin">{{ origin }}</div>
          <div>{{ content }}</div>
          <img v-if="img?.url" :src="img.url" />
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