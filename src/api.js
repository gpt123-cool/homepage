import _ from 'lodash'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ref } from 'vue'

import { openaiApiKey, role, ar } from './settings'

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

async function getMessageByContent(c, ts) {
  const resp = await fetch('https://gpt123.cool/api/v9/channels/1086185404337762377/messages?limit=25')
  const messages = await resp.json()
  return messages.find(({ content, timestamp, message_reference: { message_id } = {} }) =>
    !message_id && Date.parse(timestamp) > ts && content.startsWith(`**${c}`)
  )
}

async function sendToMj(content) {
  const resp = await fetch('https://gpt123.cool/api/v9/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 2,
      application_id: '936929561302675456',
      guild_id: '1086185404337762374',
      channel_id: '1086185404337762377',
      session_id: '2c1275dcd35e14f4d57c30c1fe2bdd31',
      data: {
        version: '1077969938624553050',
        id: '938956540159881230',
        name: 'imagine',
        'type': 1,
        options: [{ type: 3, name: 'prompt', value: content }],
        application_command:{
          id: '938956540159881230',
          application_id: '936929561302675456',
          version: '1077969938624553050',
          default_permission: true,
          default_member_permissions: null,
          type: 1,
          nsfw:false,
          name: 'imagine',
          description: 'Create images with Midjourney',
          dm_permission: true,
          options: [{ type: 3, name: 'prompt', description: 'The prompt to imagine', required: true }]},
          attachments:[]
        },
        // nonce: '1090892875765383168'
        nonce: `${Date.now()}`
      })
  })
}

export function mjToMessage(msg) {
  const { id, referenceMessageId, components = [], content, attachments: [{ url, width, height } = {}] } = msg
  if (components.length === 2 && components[0].components.length === 5) {
    components[1].components.push(components[0].components.pop())
  }
  const sizeQuery = Math.max(width, height) > 1024 ? `?width=${width / 4}&height=${height / 4}` : ''
  return { id, referenceMessageId, done: msg.components.length > 0, role: 'mj', content: url ? `${content.replace(/\<\@\d+\>/g, '')}
    ![${content}](${url.replace('cdn.discordapp.com', 'gpt123.cool')}${sizeQuery} "${content}")
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

    const now = Date.now()
    const existingMsg = await getMessageByContent(content, now)
    if (existingMsg) {
      setMessage(existingMsg)
    } else {
      await sendToMj(content + ar.value.value)
      let tries = 0, msg
      do {
        await new Promise(r => setTimeout(r, 5000))
        msg = await getMessageByContent(content, now)
        msg && setMessage(msg)
        if (!msg && tries++ > 4) {
          throw new Error('MJ Request Error.')
        }
      } while(!msg || msg.components.length === 0)
    }
  } catch (e) {
    messages.value.push({ role: 'mj', error: true, content: '画图请求失败' })
    console.error(e)
  } finally {
    drawing.value = false
  }
}