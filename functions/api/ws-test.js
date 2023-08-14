
export function onRequest({ env }) {
  return new Promise((resolve, reject) => {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
    ws.addEventListener('open', () => {
      console.log('ws open')
      clearTimeout(tm)
      resolve(new Response(readable, { status: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' } }))
      ws.send(`{"op":2,"d":{"token":"${env.MJ_TOKEN}","capabilities":8189,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":false}}`)

      setTimeout(() => writer.close(), 3000)
    })

    ws.addEventListener('message', (event) => {
      writer.write(event.data + '\n')
    })
    
    const tm = setTimeout(reject, 5000)
  })
}