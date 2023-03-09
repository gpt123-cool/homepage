import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ref } from 'vue'

import { openaiApiKey } from './settings'

export const messages = ref([])

export async function completions(content) {
  try {
    messages.value.push({ role: 'user', content })
    await fetchEventSource(
      'https://gpt123.cool/v1/chat/completions',
      {
        method: 'POST',
        body: JSON.stringify({ stream: true, model: 'gpt-3.5-turbo', temperature: 0.6, messages: messages.value.filter(m => !m.error).slice(-10) }),
        headers: {
          'Authorization': `Bearer ${openaiApiKey.value}`,
          'Content-Type': 'application/json'
        },
        onerror(e) { throw e },
        onmessage(msg) {
          const { data } = msg
          if (data === '[DONE]') {
            delete messages.value[messages.value.length - 1].thinking
          } else {
            const { choices: [{ delta }] } = JSON.parse(data)
            if (delta.role) {
              messages.value.push({ ...delta, content: '', thinking: true })
            } else if (delta.content) {
              messages.value[messages.value.length - 1].content += delta.content
            }
          }
        }
      }
    )
  } catch(e) {
    // const err = e.response ? e.response.data.error.message : e.message
    // messages.value.push({ role: 'assistant', content: err || e.message || e.toString(), error: true })
    messages.value.push({ role: 'assistant', error: true, content: '请求错误，检查API KEY是否正确，以及是否还有访问限额。' })
  }
}
