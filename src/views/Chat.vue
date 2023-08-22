<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { NSpace, NIcon } from 'naive-ui'
import { Robot, User } from '@vicons/fa'
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
      <n-space vertical size="large">
        <div class="message" v-for="{ content, role } in messages">
          <n-icon class="icon" v-if="role === 'assistant'" :component="Robot" size="24" />
          <div style="flex-grow: 1;" v-if="role === 'user'"></div>
          <div :class="{ user: role === 'user', content: true }">
            <markdown :source="content"></markdown>
          </div>
          <n-icon class="icon" v-if="role === 'user'" :component="User" size="24" />
        </div>
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

    .message {
      display: flex;
      gap: 15px;

      .icon {
        margin-top: 12px;
      }

      .content {
        flex-grow: 1;
        background-color: #35373a;
        border-radius: 10px;
        padding: 0 10px;

        &.user {
          flex-grow: 0;
          background-color: #59b169;
          color: black;
        }
      }
    }
  }
}
</style>