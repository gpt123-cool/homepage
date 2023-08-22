import _ from 'lodash'
import { ref } from 'vue'

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
      msg.content = ''
      for await (const delta of chatCompletion([
        { role: 'system', content: MIDJOURNEY_EXPLANATION },
        { role: 'user', content }
      ])) {
        msg.content += delta
      }

      msg.origin = content
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
  } finally {
    drawing.value = false
  }
}