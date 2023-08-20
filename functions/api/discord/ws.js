import { Sse } from '../common'

export function onRequest({ request, env }) {
  const sse = Sse()

  const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
  ws.addEventListener('message', ({ data }) => sse.write(data))

  ws.addEventListener('open', () => {
    const interval = setInterval(() => ws.send(`{"op":1,"d":6}`), 40000)
 
    ws.addEventListener('close', () => {
      clearInterval(interval)
      sse.close()
    })

    ws.addEventListener('error', () => {
      clearInterval(interval)
      sse.close()
    })

    ws.send(`{"op":2,"d":{"token":"${env.MJ_TOKEN}","intents":512,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":true}}`)
  })
 
  return sse.response
}