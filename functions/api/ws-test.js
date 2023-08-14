
export function onRequest({ env }) {
  return new Promise((resolve, reject) => {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    const tm = setTimeout(reject, 5000)
    const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
    ws.addEventListener('open', () => {
      clearTimeout(tm)
      console.log('ws open')
      writer.write(encoder.encode('ws connected...\n'))

      ws.send(`{"op":2,"d":{"token":"${env.MJ_TOKEN}","capabilities":8189,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":false}}`)

      setTimeout(() => writer.close(), 15000)
      resolve(new Response(readable, { status: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' } }))
    })

    ws.addEventListener('message', (event) => {
      console.log('message:', event)
      writer.write(encoder.encode(event.data + '\n'))
    })
  })
}