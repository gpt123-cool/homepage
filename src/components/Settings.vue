<script setup>
import { openaiApiKey, roles, role, ars, ar  } from '../settings'
</script>

<template>
<div class="settings">
  <div class="row">
    <input type="text" placeholder="OPENAI API KEY" v-model="openaiApiKey" />
    <button @click="$emit('SETTINGS_OK')">OK</button>
  </div>
  <p>API_KEY只被保存于浏览器的localStorage中，不会被服务器保存。</p>
  <div class="row">
    <select v-model="role">
      <option v-for="r of roles" :value="r">{{ r.name }}</option>
    </select>
    <select v-if="role.draw" v-model="ar">
      <option v-for="a of ars" :value="a">{{ a.name }}</option>
    </select>
  </div>
</div>
</template>

<style scoped lang="scss">
.settings {
  .row {
    display: flex;
    gap: 10px;
    align-items: center;

    select {
      flex-grow: 1;
      appearance: none;
      background-color: #94A3B826;
      border: 1px solid #94A3B826;
      padding: 10px;
    }
  }
}
</style>