import { ref, watch } from 'vue'

function localstorageRef(key, defaultValue) {
  const value = ref(localStorage.getItem(key) || defaultValue)
  watch(value, v => localStorage.setItem(key, v))
  return value
}

const userLanguage = navigator.language || navigator.userLanguage
const language = localstorageRef('UI.LANGUAGE', userLanguage === 'zh-CN' ? 'zh-CN' : 'en-US')

export { language }