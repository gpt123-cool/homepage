<script setup>
import { computed } from 'vue'
import Markdown from 'vue3-markdown-it';

import { messages } from '../api'

const cMessages = computed({
  get() {
    return [
      ...messages.value,
      ...messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'user' ? [{ role: 'assistant', content: 'AI正在思考...' }] : []
    ]
  }
})
</script>

<template>
<div v-for="msg of cMessages" :class="{ row: true, user: msg.role === 'user' }">
  <div class="avatar bot"><img v-if="msg.role === 'assistant'" src="../assets/bot.svg" /></div>
  <markdown class="content" :source="msg.content"></markdown>
  <div class="avatar" v-if="msg.role === 'user'"><font-awesome-icon icon="fa-solid fa-user" /></div>
</div>
</template>

<style scoped lang="scss">
.row {
  display: flex;
  align-items: start;
  gap: 10px;
  margin: 10px 0;

  .avatar {
    width: 24px;
    padding-top: 16px;

    >img {
      width: 24px;
    }
  }
  .content {
    flex-grow: 1;
    padding: 0 10px;
    overflow-x: auto;
    text-align: left;
    background-color: #94A3B826;
  }

  &.user {
    .bot {
      flex-grow: 1;
    }

    .content {
      flex-grow: 0;
      background-color: #59b169;
      color: #000;
    }
  }
}
</style>