import _ from 'lodash'
import { ref } from 'vue'

import { role, ar } from './settings'

export const messages = ref([])

export async function completions(content) {
  try {
    messages.value.push({ role: 'user', content })
    const messagesToSend = messages.value.filter(m => !m.error && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    if (role.value.message) messagesToSend.unshift({ role: 'system', content: role.value.message })

    let messageResponse
    for await (const data of fetchSse(
      'https://api.gpt123.cool/chat',
      {
        method: 'POST',
        body: JSON.stringify({ stream: true, model: 'gpt-3.5-turbo', temperature: 0.6, messages: messagesToSend }),
        headers: {
          // 'Authorization': `Bearer ${openaiApiKey.value.trim()}`,
          'Content-Type': 'application/json'
        }
      }, true)) {
        if (data === '[DONE]') {
          delete messageResponse.thinking
        } else {
          const { choices: [{ delta: { role, content } }] } = JSON.parse(data)
          if (role) {
            if (messageResponse) {
              messageResponse.content = content || ''
              messageResponse.thinking = true
            } else {
              messages.value.push({ role, content: content || '', thinking: true })
              messageResponse = _.last(messages.value)
            }
          } else if (content) {
            messageResponse.content += content
          }
        }
      }
  } catch(e) {
    console.error(e)
    // const err = e.response ? e.response.data.error.message : e.message
    // messages.value.push({ role: 'assistant', content: err || e.message || e.toString(), error: true })
    messages.value.push({ role: 'assistant', error: true, content: '请求错误，检查API KEY是否正确，以及是否还有访问限额。' })
  }
}

export const drawing = ref(false)

async function *fetchSse(url, opts, raw = false) {
  const resp = await fetch(url, opts)

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let finished = false
  let rest = ''
  do {
    const { done, value } = await reader.read()
    if (done) {
      finished = true
    } else {
      const chunk = rest + decoder.decode(value)
      const lines = chunk.split('\n')
      rest = chunk.endsWith('\n') ? '' : lines.pop()

      for (const line of lines) {
        if (line.trim()) {
          const data = line.replace('data: ', '')
          yield raw ? data : JSON.parse(data)
        }
      }
    }
  } while(!finished)

  if (rest) {
    console.error('This should not happend, rest:', rest)
  }
}

async function sendToMj(prompt) {
  for await (const msg of fetchSse(
    'https://api.gpt123.cool/imagine',
    { method: 'POST', body: prompt }
  )) {
    setMessage(msg)
  }
}

export async function upscale({ id, custom_id }) {
  let lastMsg
  for await (const msg of fetchSse(`https://api.gpt123.cool/custom?message_id=${id}&custom_id=${custom_id}`)) {
    if (msg.t === 'MESSAGE_CREATE') {
      lastMsg = msg
    }
  }

  const msg = messages.value.find(m => m.id === id)
  msg.upscales = [...msg.upscales || [], lastMsg]
}

export async function makeVariation({ id, custom_id }) {
  for await (const msg of fetchSse(`https://api.gpt123.cool/custom?message_id=${id}&custom_id=${custom_id}`)) {
    if (msg.d?.id !== id) {
      setMessage(msg)
    }
  }
}

export function mjToMessage(msg) {
  const { id, referenceMessageId, components = [], content, attachments: [{ url, width, height } = {}] } = msg
  if (components.length === 2 && components[0].components.length === 5) {
    components[1].components.push(components[0].components.pop())
  }
  const sizeQuery = Math.max(width, height) > 1024 ? `?width=${width / 4}&height=${height / 4}` : ''
  const done = msg.components?.length > 0 && msg.components[0].components?.[0]?.label !== 'Cancel Job'
  return { id, referenceMessageId, done, role: 'mj', content: url ? `${content.replace(/\<\@\d+\>/g, '')}
    ![${content}](${url.replace('cdn.discordapp.com', 'img.gpt123.cool')}${sizeQuery})
  ` : content, components }
}

async function setMessage(msg) {
  if (msg.t === 'MESSAGE_CREATE' || msg.t === 'MESSAGE_UPDATE') {
    const message = mjToMessage(msg.d)

    const lm = _.last(messages.value)
    if (lm.role === 'mj' && !lm.done) messages.value.pop()
    messages.value.push(message)  
  }
}

export async function draw(content) {
  try {
    drawing.value = true

    if (!content || typeof content !== 'string') {
      if (role.value.english) {
        content = _.last(messages.value).content
        content = content.replace('英文翻译：', '')
        content = content.replace(/I am sorry, as an AI language model, I cannot draw images. However, I can provide you with a textual description of an image of.*?\./, '')
      } else {
        const msg = [{ role: 'system', content: '将我的话翻译成英文' }, _.last(messages.value)]
        msg[1].content = _.last(msg[1].content.split('\n'))
        const resp = await fetch('https://api.gpt123.cool/chat', {
          method: 'POST',
          body: JSON.stringify({ model: 'gpt-3.5-turbo', temperature: 0.6, messages: msg }),
          headers: {
            // 'Authorization': `Bearer ${openaiApiKey.value.trim()}`,
            'Content-Type': 'application/json'
          }
        })

        const { choices: [{ message: { content: c } }] } = await resp.json()
        content = c
      }

      const lines = content.split('\n')
      if (lines.length > 1) content = lines.filter(ln => ln).slice(1).join(' ')
    }

    await sendToMj(content + ar.value.value)
  } catch (e) {
    messages.value.push({ role: 'mj', error: true, content: '画图请求失败' })
    console.error(e)
  } finally {
    drawing.value = false
  }
}