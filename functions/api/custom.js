import { Sse, discordWs, Midjourney } from './common'

export function onRequest({ request, env }) {
  const sse = Sse()

  async function custom() {
    // const { message_id, custom_id } = request
    const url = new URL(request.url);
    const message_id = url.searchParams.get('message_id');
    const custom_id = url.searchParams.get('custom_id');
    if (!message_id || !custom_id) throw new Error('Param error.');

    const ws = await discordWs(env.MJ_TOKEN)
    const mj = new Midjourney(env.MJ_TOKEN)
    const nonce = mj.getNonce()
  
    const payload = await mj.customPayload(message_id, custom_id, nonce)
    await mj.interactions(payload)
  
    ws.addEventListener('message', ({ data }) => {
      if (!data.startsWith('{"t":"MESSAGE')) return

      if (data.indexOf(nonce) > 0 || data.indexOf(message_id) > 0) {
        const msg = JSON.parse(data)
        if (msg.d.id !== message_id) {
          sse.write(data)
          if (mj.isDone(msg)) {
            ws.close()
            sse.close()        
          }
        }
      }
    })
  }
  
  custom().catch(e => {
    console.error(e)
    sse.write({ error: 'Opps...' })
    sse.close()
  })

  return sse.response
}