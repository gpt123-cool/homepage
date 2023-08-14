
export function onRequest({ env }) {
  return new Promise((resolve, reject) => {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    const tm = setTimeout(reject, 5000)
    const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
    ws.addEventListener('open', () => {
      clearTimeout(tm)
      console.log('ws open')

      ws.send(`{"op":2,"d":{"token":"${env.MJ_TOKEN}","capabilities":8189,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":false}}`)

      setTimeout(() => writer.close(), 15000)
      writer.write('ws connected...\n')
      resolve(new Response(readable, { status: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' } }))
    })

    ws.addEventListener('message', (event) => {
      writer.write(event.data + '\n')
    })
    
  })
}