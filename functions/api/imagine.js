import { Sse, discordWs, Midjourney } from './common'

export function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Hmm~~~?', { status: 404, statusText: 'Not Found.' })

  const sse = Sse()

  async function imagine() {
    let prompt = await request.text()

    const ws = await discordWs(env.MJ_TOKEN)
    
    const mj = new Midjourney(env.MJ_TOKEN)
    const nonce = mj.getNonce()
    prompt += ` --seed ${nonce}`;

    const payload = await mj.imaginePaylod(prompt, nonce)
    await mj.interactions(payload)

    ws.addEventListener('message', ({ data }) => {
      if (data.indexOf(nonce) > 0) {
        sse.write(data)

        const msg = JSON.parse(data)
        if (mj.isDone(msg)) {
          ws.close()
          sse.close()
        }
      }
    })
  }
  
  imagine().catch(e => {
    console.error(e)
    sse.write({ error: 'Opps...' })
    sse.close()
  })

  return sse.response
}