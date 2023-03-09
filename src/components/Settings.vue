<script setup>
import { openaiApiKey } from '../settings'
</script>

<template>
<div class="settings">
  <div class="row">
    <input type="text" placeholder="OPENAI API KEY" v-model="openaiApiKey" />
  </div>
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