<script setup>
import Markdown from 'vue3-markdown-it'
import { ref, watch } from 'vue'

import { messages } from '../api'
import ComponentButton from './ComponentButton.vue'
const el = ref()
function scrollToBottom() { el.value.scrollTop = el.value.scrollHeight }
watch(() => messages.value.length, () => setTimeout(scrollToBottom, 100))
</script>

<template>
<div class="messages" ref="el">
  <div v-for="msg of messages" :class="{ row: true, user: msg.role === 'user' || msg.role === 'mode', error: msg.error }">
    <div class="avatar bot"><img v-if="msg.role === 'assistant' || msg.role === 'mj'" src="../assets/bot.svg" /></div>
    <div class="content">
      <markdown :source="msg.content"></markdown>
      <div v-for="u of msg.upscales" class="upscaled">
        <img :src="u.d.attachments[0].url.replace('cdn.discordapp.com', 'img.gpt123.cool')" />
      </div>
      <div v-if="msg.role === 'mj' && msg.done" class="upscale">
        <component-button v-for="c of msg.components[0].components" :up="{ id: msg.id, ...c }" />
      </div>
      <div v-if="msg.role === 'mj' && msg.done && msg.components?.length >= 2" class="upscale">
        <component-button v-for="c of msg.components[1].components" :up="{ id: msg.id, ...c }" />
      </div>
    </div>
    <div class="avatar" v-if="msg.role === 'user' || msg.role === 'mode'"><font-awesome-icon icon="fa-solid fa-user" /></div>
  </div>
</div>
</template>

<style scoped lang="scss">
.messages {
  flex: 1;
  flex-shrink: 0;
  height: 0;
  overflow-y: auto;
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

    :deep(img) {
      max-width: 100%;
      display: block;
    }
    .upscale {
      padding-bottom: 10px;
      display: flex;
      gap: 10px;
    }

    .upscaled {
      padding-bottom: 10px;
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