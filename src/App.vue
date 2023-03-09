<script setup>
</script>

<template>
  <div class="head">
    <img src="./assets/bot.svg" class="logo" />
    <span>狗屁通</span>
    <span class="ph">123</span>
    <span class="cool">Cool</span>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  .logo {
    height: 48px;
    will-change: filter;
    transition: filter 300ms;
    margin-right: 10px;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .ph {
    color: #000;
    background-color: #ff9900;
    border-radius: 3px;
    margin: 5px;
    padding: 0 5px;
  }
  .cool{
    background: linear-gradient(to right, rgba(56,189,248,var(--un-from-opacity, 1)), rgba(5,150,105,var(--un-to-opacity, 1)));
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
