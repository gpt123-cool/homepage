import axios from 'axios'
import { ref } from 'vue'

import { openaiApiKey } from './settings'

export const messages = ref([])

export async function completions(content) {
  messages.value.push({ role: 'user', content })
  const { data: { choices: [{ message }] } } = await axios.post(
    'https://gpt123.cool/v1/chat/completions',
    JSON.stringify({ model: 'gpt-3.5-turbo', temperature: 0.6, messages: messages.value }),
    {
      headers: {
        'Authorization': `Bearer ${openaiApiKey.value}`,
        'Content-Type': 'application/json'
      }
    }
  )

  messages.value.push(message)
  if (messages.value.length > 10) message.value.shift()
}
