import _ from 'lodash'
import { ref } from 'vue'
import fetchParser from '@async-util/fetch'

export const thinking = ref(false)
export const messages = ref([])


export async function chat(content) {
  thinking.value = true

  try {
    messages.value.push({ role: 'user', content })
    const messagesToSend = messages.value.filter(m => !m.error && (m.role === 'user' || m.role === 'assistant')).slice(-10)

    messages.value.push({ role: 'assistant', content: '' })
    const assistantResp = _.last(messages.value)
    for await (const delta of chatCompletion(messagesToSend)) {
      assistantResp.content += delta
    }
  } catch (e) {
    const msg = _.last(messages.value)
    msg.error = true
    msg.content = 'ERROR'
  } finally {
    thinking.value = false
  }
}
