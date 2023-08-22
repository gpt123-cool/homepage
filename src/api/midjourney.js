import _ from 'lodash'
import { ref } from 'vue'
import fetchParser from '@async-util/fetch'

import { chatCompletion } from './openai'
import { MIDJOURNEY_EXPLANATION, ars } from './constants'

export const drawing = ref(false)
export const messages = ref([])

export async function draw(content, useGpt = true) {
  drawing.value = true

  try {
    messages.value.push({ })
    const msg = _.last(messages.value)

    if (useGpt) {
      msg.origin = content
      msg.content = ''
      for await (const delta of chatCompletion([
        { role: 'system', content: MIDJOURNEY_EXPLANATION },
        { role: 'user', content }
      ])) {
        msg.content += delta
      }

      content = msg.content
    } else {
      msg.content = content
    }

    const isEnglish = msg.content.match(/[a-zA-Z0-9 ]/g)?.length > content.length * 0.8
    if (!isEnglish) {
      msg.content = ''
      for await (const delta of chatCompletion([
        { role: 'system', content: 'Translate to english.' },
        { role: 'user', content }
      ])) {
        msg.content += delta
      }

      content = msg.content
    }

    if (content.indexOf('Please provide more information') >= 0) return

    const fp = await fetchParser('/api/imagine', { method: 'POST', body: content })
    for await (const { data: { t, d } } of fp.sse(true)) {
      if (t === 'MESSAGE_CREATE' || t === 'MESSAGE_UPDATE') {
        const { id, /*referenceMessageId,*/ components = [], content, attachments: [{ url, width, height } = {}] } = d
        msg.id = id
        msg.content = content.replace('- <@1085059674434437130> ', '')
        msg.components = components

        if (url) {
          const sizeQuery = Math.max(width, height) > 1024 ? `?width=${width / 4}&height=${height / 4}` : ''
          msg.img = { url: `${url.replace('cdn.discordapp.com', 'img.gpt123.cool')}${sizeQuery}`, width, height }  
        }
      }
    }
  } finally {
    drawing.value = false
  }
}