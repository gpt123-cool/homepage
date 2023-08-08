<script setup>
import { openaiApiKey, midjourneyToken, roles, role, ars, ar  } from '../settings'
</script>

<template>
<div class="settings">
  <div class="row">
    <input type="text" placeholder="MIDJOURNEY TOKEN" v-model="midjourneyToken" />
  </div>
  <div class="row">
    <input type="text" placeholder="OPENAI API KEY" v-model="openaiApiKey" />
    <button @click="$emit('SETTINGS_OK')">OK</button>
  </div>
  <p>API_KEY只存在浏览器localStorage,服务器不会保存</p>
  <div class="row">
    <div>模式：</div>
    <select v-model="role">
      <option v-for="r of roles" :value="r">{{ r.name }}</option>
    </select>
    <select v-if="role.draw" v-model="ar">
      <option v-for="a of ars" :value="a">{{ a.name }}</option>
    </select>
  </div>

  <p>API_KEY获取地址<a href="https://platform.openai.com/account/api-keys">https://platform.openai.com/account/api-keys</a></p>
  <p>也可通过淘宝/闲鱼购买</p>
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
      color: #94A3B8;
      background-color: #94A3B826;
      border: 1px solid #94A3B826;
      padding: 10px;
    }
  }
}
</style>