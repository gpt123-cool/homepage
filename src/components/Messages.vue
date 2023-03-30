<script setup>
import Markdown from 'vue3-markdown-it'
import { ref, watch } from 'vue'

import { messages } from '../api'

const el = ref()
watch(() => messages.value.length, () => setTimeout(() => el.value.scrollTop = el.value.scrollHeight, 100))
</script>

<template>
<div class="messages" ref="el">
  <div v-for="msg of messages" :class="{ row: true, user: msg.role === 'user', error: msg.error }">
    <div class="avatar bot"><img v-if="msg.role === 'assistant' || msg.role === 'mj'" src="../assets/bot.svg" /></div>
    <markdown class="content" :source="msg.content"></markdown>
    <div class="avatar" v-if="msg.role === 'user'"><font-awesome-icon icon="fa-solid fa-user" /></div>
  </div>
</div>
</template>

<style scoped lang="scss">
.messages {
  flex: 1;
  flex-shrink: 0;
  height: 0;
  overflow-y: scroll;
}
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
    text-align: left;
    background-color: #94A3B826;
    overflow-x: hidden;

    ::v-deep img {
      max-width: 100%;
      display: block;
    }
  }

  &:last-child {
    margin: 0;
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

  &.error {
    .content {
      color: red;
    }
  }
}
</style>