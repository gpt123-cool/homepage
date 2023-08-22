import { ref, watch } from 'vue'

function localstorageRef(key, defaultValue) {
  const value = ref(localStorage.getItem(key) || defaultValue)
  watch(value, v => localStorage.setItem(key, v))
  return value
}

function localstorageJsonRef(key, defaultValue) {
  const value = ref(JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue)))
  watch(value, v => localStorage.setItem(key, JSON.stringify(v)))
  return value
}

const userLanguage = navigator.language || navigator.userLanguage
export const language = localstorageRef('UI.LANGUAGE', userLanguage === 'zh-CN' ? 'zh-CN' : 'en-US')

export const enterToSend = localstorageJsonRef('UI.ENTER_TO_SEND', true)
