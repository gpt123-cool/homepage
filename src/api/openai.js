import _ from 'lodash'
import { ref } from 'vue'
import fetchParser from '@async-util/fetch'

import { gptVersion, openaiApiKey } from '../settings'

export const thinking = ref(false)
export const messages = ref([])

export async function *chatCompletion(messages) {
  switch (gptVersion.value) {
    case 'claude3': return yield *claude(messages)
    default: return yield *gpt(messages)
  }
}

async function *gpt(messages) {
  const fp = await fetchParser('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ stream: true, model: gptVersion.value, temperature: 0.6, messages }),
    headers: {
      ...openaiApiKey.value.trim() ? { 'Authorization': `Bearer ${openaiApiKey.value.trim()}` } : {},
      'Content-Type': 'application/json'
    }
  })

  for await (const { data } of fp.sse(true)) {
    const delta = data.choices?.[0].delta?.content
    if (delta) yield delta
  }
}

async function *claude(messages) {
  const fp = await fetchParser('/api/claude', {
    method: 'POST',
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content: [ { type: 'text', text: content } ] })),
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024 * 16,
      temperature: 0.5,
      top_k: 250,
      top_p: 1,
      stop_sequences: [ '\n\nHuman:' ]
    }),
    headers: { 'Content-Type': 'application/json' }
  })

  for await (const { data } of fp.sse(true)) {
    const delta = data.delta?.text
    if (delta) yield delta
  }
}

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
