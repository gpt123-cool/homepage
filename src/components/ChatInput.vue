<template>
  <div class="chat-input">
    <textarea type="text" placeholder="说点啥..." rows="1" />
    <button>发送</button>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 10px;
  align-items: center;

  * {
    border-radius: 0;
    color: #94A3B8;
    background-color: #94A3B826;
  }

  textarea {
    // height: 48px;
    flex-grow: 1;
    box-sizing: border-box;
    padding: 12px;
    resize: none;
    border: none;
    outline: none;
  }
  button {
    padding: 8px 16px;
  }
}
</style>