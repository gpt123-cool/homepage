<script setup>
import { NCard, NGrid, NFormItemGi, NSelect, NSwitch, NButton } from 'naive-ui'
import { language, enterToSend, gptVersion, gptVersions } from '../settings'

const languages = [
  { label: 'English', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' }
]

function clear() {
  if (confirm('Are you sure to clear all data?')) {
    localStorage.removeItem('chat-messages')
    location.reload()
  }
}
</script>

<template>
  <div class="page">
    <n-card :title="$t('ui.ui')">
      <n-grid cols="1 400:2 600:3 800:4 1000:5 1200:6" x-gap="20">
        <n-form-item-gi :label="$t('ui.language')">
          <n-select :options="languages" v-model:value="language" />
        </n-form-item-gi>
        <n-form-item-gi :label="$t('ui.gptVersion')">
          <n-select :options="gptVersions" v-model:value="gptVersion" />
        </n-form-item-gi>
        <n-form-item-gi :label="$t('ui.enterToSend')">
          <n-switch v-model:value="enterToSend" />
        </n-form-item-gi>
      </n-grid>
    </n-card>
    <n-card :title="DATA">
      <n-grid cols="1 400:2 600:3 800:4 1000:5 1200:6" x-gap="20">
        <n-form-item-gi :label="$t('ui.clear')">
          <n-button @click="clear">{{ $t('ui.clear') }}</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-card>
  </div>
</template>