<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { NSpace, NSelect } from 'naive-ui'
import { messages, draw, drawing } from '../api/midjourney'
import { drawModes, drawMode, ars, ar } from '../settings'

import ComponentButton from '../components/ComponentButton.vue'
import ChatInput from '../components/ChatInput.vue'

const el = ref(null)
const scrollToBottom = _.throttle(() => { if (el.value) el.value.scrollTop = el.value.scrollHeight }, 20)
watch(() => _.last(messages.value)?.content, scrollToBottom)
</script>

<template>
  <div class="page">
    <n-space style="padding-bottom: 10px;" size="large">
      <n-select :options="drawModes" v-model:value="drawMode" :consistent-menu-width="false" />
      <n-select :options="ars" v-model:value="ar" :consistent-menu-width="false" />
    </n-space>
    <div class="messages" ref="el">
      <n-space vertical size="large">
        <div v-for="{ id, origin, img, content, components } of messages" class="message">
          <div v-if="origin">{{ origin }}</div>
          <div>{{ content || '...' }}</div>
          <img v-if="img?.url" :src="img.url" @load="scrollToBottom" />
          <!-- {{ components }} -->
          <n-space v-for="cs of components" size="small">
            <component-button v-for="c of cs.components" :message_id="id" :up="c" />
          </n-space>
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
        margin: 10px 0;
      }
    }
  }
}
</style>