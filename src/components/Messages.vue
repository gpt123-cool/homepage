<script setup>
import Markdown from 'vue3-markdown-it';

import { messages } from '../api'
</script>

<template>
<div class="messages">
  <div v-for="msg of messages" :class="{ row: true, user: msg.role === 'user', error: msg.error }">
    <div class="avatar bot"><img v-if="msg.role === 'assistant'" src="../assets/bot.svg" /></div>
    <markdown class="content" :source="msg.content"></markdown>
    <div class="avatar" v-if="msg.role === 'user'"><font-awesome-icon icon="fa-solid fa-user" /></div>
  </div>
</div>
</template>

<style scoped lang="scss">
.messages {
  flex-grow: 1;
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