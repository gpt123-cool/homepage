import { ref, watch } from 'vue'

const LSK = 'OPENAI_API_KEY'
const openaiApiKey = ref(localStorage.getItem(LSK))
watch(openaiApiKey, v => localStorage.setItem(LSK, v.trim()))

export { openaiApiKey }