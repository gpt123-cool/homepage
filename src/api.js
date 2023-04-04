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

export const drawing = ref(false)

async function getMessageByContent(content) {
  const resp = await fetch('https://gpt123.cool/api/v9/channels/1086185404337762377/messages?limit=10')
  const messages = await resp.json()
  return messages.find(m => m.content.startsWith(`**${content}`))
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

async function setMessage(msg) {
  const { id, content, attachments: [{ url } = {}] } = msg
  const message = { id, done: msg.components.length > 0, role: 'mj', content: url ? `${content.replace(/\<\@\d+\>/g, '')}
    ![${content}](${url.replace('cdn.discordapp.com', 'gpt123.cool')} "${content}")
  ` : content}

  const lm = _.last(messages.value)
  if (lm.role === 'mj' && !lm.done) messages.value.pop()
  messages.value.push(message)
}

export async function draw() {
  try {
    drawing.value = true
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

    const { choices: [{ message: { content } }] } = await resp.json()
    const existingMsg = await getMessageByContent(content)
    if (existingMsg) {
      setMessage(existingMsg)
    } else {
      await sendToMj(content)
      let tries = 0, msg
      do {
        await new Promise(r => setTimeout(r, 5000))
        msg = await getMessageByContent(content)
        msg && setMessage(msg)
        if (!msg && tries++ > 4) {
          throw new Error('MJ Request Error.')
        }
      } while(!msg || msg.components.length === 0)
    }
  } catch (e) {
    messages.value.push({ role: 'mj', error: true, content: '画图请求失败' })
  } finally {
    drawing.value = false
  }
}