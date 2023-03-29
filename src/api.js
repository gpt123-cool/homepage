import _ from 'lodash'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ref } from 'vue'

import { openaiApiKey, role } from './settings'

export const messages = ref([])

export async function completions(content) {
  try {
    messages.value.push({ role: 'user', content })
    const messagesToSend = messages.value.filter(m => !m.error && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    if (role.value.message) messagesToSend.unshift({ role: 'system', content: role.value.message })

    await fetchEventSource(
      'https://gpt123.cool/v1/chat/completions',
      {
        method: 'POST',
        body: JSON.stringify({ stream: true, model: 'gpt-3.5-turbo', temperature: 0.6, messages: messagesToSend }),
        headers: {
          'Authorization': `Bearer ${openaiApiKey.value.trim()}`,
          'Content-Type': 'application/json'
        },
        onerror(e) { throw e },
        onmessage(msg) {
          const { data } = msg
          if (data === '[DONE]') {
            delete _.last(messages.value).thinking
          } else {
            const { choices: [{ delta }] } = JSON.parse(data)
            if (delta.role) {
              messages.value.push({ ...delta, content: '', thinking: true })
            } else if (delta.content) {
              _.last(messages.value).content += delta.content
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
