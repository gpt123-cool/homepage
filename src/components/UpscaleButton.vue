<script setup>
import { drawing, messages } from '../api'

defineProps({
  up: Object
})

async function updateMessageById(id) {
  const msg = messages.value.find(m => m.id === id)
  const resp = await fetch('https://gpt123.cool/api/v9/channels/1086185404337762377/messages?limit=10')
  const messagesResp = await resp.json()
  const msgResp = messagesResp.find(m => m.id === id)
  msg.components = msgResp.components

  const upscales = messagesResp.filter(({ attachments: [{ url } = {}], message_reference: { message_id } = {} }) => url && message_id === id)
  if (upscales.length > 0) {
    msg.upscales = upscales.reverse()
    return msg.components[0].components.filter(c => c.style === 1).length !== msg.upscales.length
  } else {
    return true
  }
}


async function upscale(u) {
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
      } while(await updateMessageById(u.id))
    } finally {
      drawing.value = false
    }
  }
}
</script>

<template>
<button :disabled="drawing" @click="() => upscale(up)" :class="{ active: up.style === 1 }">{{ up.label }}</button>
</template>

<style scoped>
.active {
  background-color: rgb(88, 101, 242);
  color: white;
}

button:disabled {
  color: #475569;
}
</style>