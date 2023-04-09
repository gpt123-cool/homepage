import { ref, watch } from 'vue'
import { messages } from './api'

const roles = [{
  name: '-'
}, {
  name: '作图',
  message: '我的话是一幅图像的大致内容，请补充细节，生成描述（注意：只回复描述）',
  draw: true
}, {
  name: '作图-英文',
  message: '我的话是一幅图像的大致内容，请补充细节，生成英文描述（注意：只回复描述）',
  draw: true,
  english: true
}, {
  name: '成语接龙',
  message: '我们来玩四字成语接龙，你回复的成语的第一个字要是我说的成语的最后一个字'
}]

const ars = [{
  name: '1:1',
  value: ' --v 5'
}, {
  name: '9:16',
  value: ' --v 5 --ar 9:16'
}, {
  name: '16:9',
  value: ' --v 5 --ar 16:9'
}, {
  name: '4:3',
  value: ' --v 5 --ar 4:3'
}, {
  name: '3:4',
  value: ' --v 5 --ar 3:4'
}, {
  name: '9:16 v4',
  value: ' --upbeta --ar 9:16'
}, {
  name: '16:9 v4',
  value: ' --upbeta --ar 16:9'
}]

const LSK = 'OPENAI_API_KEY'
const openaiApiKey = ref(localStorage.getItem(LSK))
watch(openaiApiKey, v => localStorage.setItem(LSK, v.trim()))

const role = ref(roles[0])
watch(role, r => {
  messages.value.push({ role: 'mode', content: '模式: ' + r.name })
})

const ar = ref(ars[0])

export { roles, role, ars, ar, openaiApiKey }