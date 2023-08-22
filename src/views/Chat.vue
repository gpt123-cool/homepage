<script setup>
import ChatInput from '../components/ChatInput.vue'

import { thinking, messages, chat } from '../api/openai'
</script>

<template>
  <div class="page">
    <!-- <div class="role">
      abc
    </div> -->
    <div class="messages">
      {{ messages }}
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
    overflow-y: auto;
  }
}
</style>