<script setup>
import { messages, draw, drawing } from '../api/midjourney'

import ChatInput from '../components/ChatInput.vue'

</script>

<template>
  <div class="page">
    <div class="messages">
      <div v-for="{ content } of messages">
        {{ content }}
      </div>
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
  }
}
</style>