<script setup>
import { openaiApiKey } from '../settings'
</script>

<template>
<div class="settings">
  <div class="row">
    <input type="text" placeholder="OPENAI API KEY" v-model="openaiApiKey" />
    <button @click="$emit('SETTINGS_OK')">OK</button>
  </div>
  <p>API_KEY只被保存于浏览器的localStorage中，不会被服务器保存。</p>
</div>
</template>

<style scoped lang="scss">
.settings {
  padding-top: 40px;
  .row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>