import { ref, watch } from 'vue'
import { messages } from './api'

const roles = [{
  name: '-'
}, {
  name: '作图',
  message: '将我说的话转换成对一幅图像的描述，只回复描述即可',
  draw: true
}, {
  name: '成语接龙',
  message: '我们来玩四字成语接龙，你回复的成语的第一个字要是我说的成语的最后一个字'
}]

const LSK = 'OPENAI_API_KEY'
const openaiApiKey = ref(localStorage.getItem(LSK))
watch(openaiApiKey, v => localStorage.setItem(LSK, v.trim()))

const role = ref(roles[0])
watch(role, r => {
  messages.value.push({ role: 'mode', content: '模式: ' + r.name })
})

export { roles, role, openaiApiKey }