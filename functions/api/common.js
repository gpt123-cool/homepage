
export const sseHeaders = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
}

export function Sse() {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  return {
    response: new Response(readable, { status: 200, statusText: 'ok', headers: sseHeaders }),
    write(data) {
      if (typeof data !== 'string') data = JSON.stringify(data)
      return writer.write(encoder.encode(`data: ${data}\n\n`))
    },
    close() {
      writer.close()
    }
  }
}

export function discordWs(mjToken) {
  return new Promise((resovle, reject) => {
    // const ws = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=9')
    const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
    const tm = setTimeout(reject, 5000)
    ws.addEventListener('open', () => {
      clearTimeout(tm)
      ws.send(`{"op":2,"d":{"token":"${mjToken}","capabilities":8189,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":false}}`)

      const interval = setInterval(() => ws.send(`{"op":1,"d":6}`), 40000)
      ws.addEventListener('close', () => clearInterval(interval))

      resovle(ws)
    })
  })
}

const ServerId = '1086185404337762374'
const guild_id = ServerId
const channel_id = '1086185404337762377'
const session_id = 'c2d354673b0caec475fe4ac13ac509e2'

function toPayload(data, nonce) {
  return {
    type: 2,
    application_id: data.application_command.application_id,
    guild_id, channel_id, session_id,
    nonce, data
  }
}

export class Midjourney {
  constructor(MJ_TOKEN) {
    this.MJ_TOKEN = MJ_TOKEN
  }

  getNonce() {
    return Math.round(Math.random() * 2 ** 32).toString()    
  }

  async commandData(name, options = [], attachments = []) {
    const command = await this.getCommand(name)

    return {
      version: command.version,
      id: command.id,
      name: command.name,
      type: command.type,
      options,
      application_command: command,
      attachments
    }
  }

  async imaginePaylod(prompt, nonce) {
    return toPayload(await this.commandData('imagine', [{ type: 3, name: 'prompt', value: prompt }]), nonce)
  }

  async customPayload(message_id, custom_id, nonce) {
    const { application_id } = await this.getCommand('imagine')

    return {
      type: 3,
      nonce,
      guild_id,
      channel_id,
      message_flags: 0,
      message_id,
      application_id,
      session_id,
      data: { component_type: 2, custom_id }
    }
  }

  async getCommand(name) {
    const searchParams = new URLSearchParams({
      type: '1',
      query: name,
      limit: '1',
      include_applications: 'true'
    })
  
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channel_id}/application-commands/search?${searchParams}`,
      { headers: { authorization: this.MJ_TOKEN }
    })

    const data = await response.json()
    if (data?.application_commands?.[0]) {
      return data.application_commands[0]
    }
  
    throw new Error(`Failed to get application_commands for command ${name}`)
  }

  async interactions(payload) {
    const resp = await fetch(
      'https://discord.com/api/v9/interactions',
      { method: 'POST', body: JSON.stringify(payload), headers: { authorization: this.MJ_TOKEN, 'Content-Type': 'application/json' } }
    )

    if (resp.status >= 400) {
      console.error("interactions error:", { payload })
      throw new Error(`${resp.status}`)
    }
  }

  isDone(msg) {
    return msg.t === 'MESSAGE_CREATE' && (
      (msg.d.attachments?.length > 0 && msg.d.components?.length > 0) ||
      (msg.d?.components?.[0]?.components?.[0]?.label === 'Appeal') ||
      (msg.d?.components?.[0]?.components?.[0]?.label === 'Resubmit')
    )    
  }
}