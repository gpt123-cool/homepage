<script setup>
import { ref } from 'vue'
import { NInput, NButton } from 'naive-ui'

const value = ref('')
const emit = defineEmits(['send'])
defineProps({ disabled: Boolean })

function send() {
  emit('send', value.value)
  value.value = ''
}
</script>

<template>
  <div class="chat-input">
    <n-input :disabled="disabled" v-model:value="value" type="textarea" :resizable="false" clearable :autosize="{ minRows: 1, maxRows: 3 }" />
    <n-button @click="send" :disabled="disabled" type="info">发送</n-button>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>