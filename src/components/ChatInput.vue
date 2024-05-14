<script setup>
import { ref, watch } from 'vue'
import { NInput, NButton } from 'naive-ui'

import { enterToSend } from '../settings'

const value = ref('')
const emit = defineEmits(['send'])
defineProps({ disabled: Boolean })

watch(value, v => {
  if (enterToSend.value && v.endsWith('\n')) {
    value.value = ''
    setTimeout(() => emit('send', v.slice(0, -1)), 0)
  }
})

function send() {
  emit('send', value.value)
  value.value = ''
}
</script>

<template>
  <div class="chat-input">
    <n-input :disabled="disabled" :placeholder="$t('input.placeholder') + ' ' + (enterToSend? $t('ui.pressEnterToSend') : '')" v-model:value="value" type="textarea" :resizable="false" clearable :autosize="{ minRows: 1, maxRows: 3 }" />
    <n-button @click="send" :disabled="disabled" type="info">{{ $t('button.send') }}</n-button>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>