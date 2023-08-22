<script setup>
import { NCard, NGrid, NFormItemGi, NSelect } from 'naive-ui'
import { language } from '../settings'

const languages = [
  { label: 'English', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' }
]
</script>

<template>
  <div class="page">
    <n-card :title="$t('ui.ui')">
      <n-grid :cols="4">
        <n-form-item-gi :label="$t('ui.language')">
          <n-select :options="languages" v-model:value="language" />
        </n-form-item-gi>
      </n-grid>
    </n-card>
  </div>
</template>