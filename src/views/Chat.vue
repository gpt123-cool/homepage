<script setup>
import ChatInput from '../components/ChatInput.vue'
</script>

<template>
  <div class="page">
    <!-- <div class="role">
      abc
    </div> -->
    <div class="messages">
      mmm
    </div>
    <chat-input />
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;

  .messages {
    flex: 1;
    overflow-y: auto;
  }
}
</style>