<script setup>
import { drawing, messages } from '../api'

defineProps({
  up: Object
})

async function updateMessageById(id, isUpscale) {
  const msg = messages.value.find(m => m.id === id)
  const resp = await fetch('https://gpt123.cool/api/v9/channels/1086185404337762377/messages?limit=10')
  const messagesResp = await resp.json()
  const msgResp = messagesResp.find(m => m.id === id)
  msg.components = msgResp.components

  if (isUpscale) {
    const upscales = messagesResp.filter(({ content, attachments: [{ url } = {}], message_reference: { message_id } = {} }) => content.indexOf('Variations') < 0 && url && message_id === id)
    if (upscales.length > 0) {
      msg.upscales = upscales.reverse()
      return msg.components[0].components.filter(c => c.style === 1).length !== msg.upscales.length
    } else {
      return true
    }
  } else {
    const variations = messagesResp.filter(({ content, attachments: [{ url } = {}], message_reference: { message_id } = {} }) => content.indexOf('Variations') >= 0 && url && message_id === id)
    if (variations.length > 0) {
      const { id: rid, components, content, attachments: [{ url } = {}] = [], message_reference: { message_id } = {} } = variations.find(v => !messages.value.find(m => m.id === v.id)) || {}
      if (rid) {
        messages.value.push({ id: rid, done: true, role: 'mj', referenceMessageId: message_id, components, content: `
${content.replace(/\<\@\d+\>/g, '')}
![${content}](${url.replace('cdn.discordapp.com', 'gpt123.cool')} "${content}")
        `})
        return msg.components[1].components.filter(c => c.style === 1).length !== messages.value.filter(c => c.referenceMessageId === id).length
      } else {
        return true
      }
    } else {
      return true
    }
  }
}


async function handelClick(u) {
  if (u.style !== 1) {
    drawing.value = true

    try {
      await fetch('https://gpt123.cool/api/v9/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 3,
          nonce: Date.now().toString(),
          guild_id: '1086185404337762374',
          channel_id: '1086185404337762377',
          message_flags: 0,
          message_id: u.id,
          application_id: '936929561302675456',
          session_id: '2c1275dcd35e14f4d57c30c1fe2bdd31',
          data: {
              'component_type': 2,
              'custom_id': u.custom_id
          }
        })
      })

      do {
        await new Promise(resolve => setTimeout(resolve, 5000))
      } while(await updateMessageById(u.id, u.label.startsWith('U')))
    } finally {
      drawing.value = false
    }
  }
}
</script>

<template>
<button :disabled="drawing" @click="() => handelClick(up)" :class="{ active: up.style === 1 }">{{ up.label }}</button>
</template>

<style scoped>
.active {
  background-color: rgb(88, 101, 242);
  color: white;
}

button {
  font-family: monospace;
  font-size: large;
}

button:disabled {
  color: #475569;
}
</style>