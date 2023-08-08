import _ from 'lodash'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ref, watch } from 'vue'

import { Midjourney } from "midjourney"

import { openaiApiKey, midjourneyToken, role, ar } from './settings'

export const messages = ref([])

export async function completions(content) {
  try {
    messages.value.push({ role: 'user', content })
    const messagesToSend = messages.value.filter(m => !m.error && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    if (role.value.message) messagesToSend.unshift({ role: 'system', content: role.value.message })

    let messageResponse
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
      }
    )
  } catch(e) {
    // const err = e.response ? e.response.data.error.message : e.message
    // messages.value.push({ role: 'assistant', content: err || e.message || e.toString(), error: true })
    messages.value.push({ role: 'assistant', error: true, content: '请求错误，检查API KEY是否正确，以及是否还有访问限额。' })
  }
}

export const drawing = ref(false)

let client
function initMjClient() {
  if (!midjourneyToken.value) return

  client = new Midjourney({
    ServerId: '1086185404337762374',
    ChannelId: '1086185404337762377',
    SalaiToken: midjourneyToken.value,
    Debug: false,
    Ws: true,
    fetch: window.fetch.bind(window)
  })
  
  client.init().catch(console.error)  
}

setTimeout(() => {
  watch(midjourneyToken, initMjClient)
  initMjClient()
}, 50)

async function sendToMj(prompt) {
  const imagine = await client.Imagine(
    prompt,
    (uri, progress) => {
      setMessage({ uri, progress, content: `${progress} ${prompt}` })
    }
  )

  setMessage(imagine)
}

export async function upscale({ id, flags = 0, custom }) {
  const upscale = await client.Custom({
    msgId: id,
    flags,
    customId: custom
  })

  const msg = messages.value.find(m => m.id === id)
  msg.upscales = [...msg.upscales || [], upscale]
}

export async function makeVariation({ id, flags = 0, custom }) {
  const varitaion = await client.Custom({
    msgId: id,
    flags,
    customId: custom,
    loading: (uri, progress) => {
      setMessage({ uri, progress, content: `${progress}` })
    }
  })

  setMessage(varitaion)
}

export function mjToMessage(msg) {
  const { id, referenceMessageId, options = [], content, uri, width = 0, height = 0, progress } = msg

  let components = []
  if (options.length === 9) {
    components.push(options.slice(0, 4))
    components.push([...options.slice(5), options[4]])
  }

  const sizeQuery = Math.max(width, height) > 1024 ? `?width=${width / 4}&height=${height / 4}` : ''
  return { id, referenceMessageId, done: progress === 'done', role: 'mj', content: uri ? `${content.replace(/\<\@\d+\>/g, '')}
    ![${content}](${uri.replace('cdn.discordapp.com', 'gpt123.cool')}${sizeQuery})
  ` : content, components }
}

async function setMessage(msg) {
  const message = mjToMessage(msg)
  const lm = _.last(messages.value)
  if (lm.role === 'mj' && !lm.done) messages.value.pop()
  messages.value.push(message)
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
        const resp = await fetch('https://gpt123.cool/v1/chat/completions', {
          method: 'POST',
          body: JSON.stringify({ model: 'gpt-3.5-turbo', temperature: 0.6, messages: msg }),
          headers: {
            'Authorization': `Bearer ${openaiApiKey.value.trim()}`,
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