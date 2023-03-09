import axios from 'axios'
import { ref } from 'vue'

import { openaiApiKey } from './settings'

export const messages = ref([])

export async function completions(content) {
  try {
    messages.value.push({ role: 'user', content })
    const { data: { choices: [{ message }] } } = await axios.post(
      'https://gpt123.cool/v1/chat/completions',
      JSON.stringify({ model: 'gpt-3.5-turbo', temperature: 0.6, messages: messages.value.slice(-10) }),
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey.value}`,
          'Content-Type': 'application/json'
        }
      }
    )

    messages.value.push(message)
  } catch(e) {
    const err = e.response ? e.response.data.error.message : e.message
    messages.value.push({ role: 'assistant', content: err || e.message || e.toString(), error: true })
  }
}
