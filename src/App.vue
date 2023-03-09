<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'

import { openaiApiKey } from './settings'
import { messages } from './api'
import Settings from './components/Settings.vue'
import ChatInput from './components/ChatInput.vue'
import Messages from './components/Messages.vue'

const showSettings = ref(!openaiApiKey.value)
const bottom = ref()

function scroll() {
  setTimeout(() => bottom.value.scrollIntoView(), 100)
}

watch(() => messages.value.length > 0 && (_.last(messages.value).thinking + _.last(messages.value).content.length), scroll)
</script>

<template>
  <div class="head">
    <img src="./assets/bot.svg" class="logo" />
    <span>狗屁通</span>
    <span class="ph">123</span>
    <span class="cool">Cool</span>
    <div style="flex-grow: 1;"></div>
    <a :class="{ active: showSettings }"><font-awesome-icon icon="fa-solid fa-gear" @click="showSettings = !showSettings" /></a>
  </div>
  <settings v-if="showSettings" @SETTINGS_OK="showSettings = false" />
  <div class="content" v-if="!showSettings">
    <messages />
    <chat-input @SEND="scroll" />
  </div>
  <div ref="bottom"></div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
  font-weight: bold;
  .logo {
    height: 48px;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .ph {
    color: #000;
    background-color: #ff9900;
    border-radius: 3px;
    padding: 0 5px;
  }
  .cool{
    background: linear-gradient(to right, rgba(56,189,248,var(--un-from-opacity, 1)), rgba(5,150,105,var(--un-to-opacity, 1)));
    -webkit-background-clip: text;
    color: transparent;
  }
  a {
    padding: 0 5px;

    &.active {
      background-color: #94A3B826;
    }
  }
}
.content {
  padding-top: 40px;
}
</style>
