<script setup>
import { h } from 'vue'
import { NIcon, NConfigProvider, NGlobalStyle, NNotificationProvider, darkTheme, NLayout, NLayoutHeader, NLayoutContent, NMenu } from 'naive-ui'

import { routes } from './routes'

const allRoutes = routes.map(r => ({ label: r.icon ? '' : r.name, key: r.path, icon: r.icon && (() => h(NIcon, { component: r.icon })) }))
const leftNav = allRoutes.slice(0, 2)
const rightNav = allRoutes.slice(2)

// const showSettings = ref(!openaiApiKey.value)
// const showSettings = ref(false)
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-notification-provider>
      <n-layout>
        <n-layout-header>
          <div class="head">
            <img src="./assets/bot.svg" class="logo" />
            <!-- <span>狗屁通</span> -->
            <!-- <span class="ph">123</span> -->
            <!-- <span class="cool">Cool</span> -->

            <div style="width: 20px;"></div>
            <n-menu :value="$route.path" :options="leftNav" mode="horizontal" @update:value="(path) => $router.replace(path)" />
            <div style="flex: 1"></div>
            <n-menu :value="$route.path" :options="rightNav" mode="horizontal" @update:value="(path) => $router.replace(path)" />
          </div>
        </n-layout-header>
        <n-layout-content>
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-notification-provider>
  </n-config-provider>
</template>

<style>
.page {
  height: calc(100vh - 62px);
  padding: 10px 15px;
  box-sizing: border-box;
}
</style>

<style scoped lang="scss">
.head {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
  font-weight: bold;
  .logo {
    height: 32px;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  // .ph {
  //   color: #000;
  //   background-color: #ff9900;
  //   border-radius: 3px;
  //   padding: 0 5px;
  // }
  // .cool{
  //   background: linear-gradient(to right, rgba(56,189,248,var(--un-from-opacity, 1)), rgba(5,150,105,var(--un-to-opacity, 1)));
  //   -webkit-background-clip: text;
  //   color: transparent;
  // }
}
</style>
