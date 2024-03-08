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

export const drawMode = localstorageRef('DRAW.MODE', 'gpt')
export const drawModes = [{
  label: 'Smart',
  value: 'gpt'
}, {
  label: 'RAW',
  value: 'raw'
}]

export const ar = localstorageRef('DRAW.AR', '')
export const ars = [{
  label: '1:1',
  value: ''
}, {
  label: '9:16',
  value: ' --ar 9:16'
}, {
  label: '16:9',
  value: ' --ar 16:9'
}, {
  label: '4:3',
  value: ' --ar 4:3'
}, {
  label: '3:4',
  value: ' --ar 3:4'
// }, {
//   label: '9:16 v4',
//   value: ' --v 4 --upbeta --ar 9:16'
// }, {
//   label: '16:9 v4',
//   value: ' --v 4 --upbeta --ar 16:9'
}]

export const gptVersion = localstorageRef('GPT.VERSION', 'gpt-3.5-turbo')
if (gptVersion.value === 'gpt-4') gptVersion.value = 'gpt-4-turbo-preview'

export const gptVersions = [
  { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
  { label: 'GPT-3.5-16K', value: 'gpt-3.5-turbo-16k' },
  { label: 'GPT-4', value: 'gpt-4-turbo-preview' }
]

export const openaiApiKey = localstorageRef('GPT.KEY', '')