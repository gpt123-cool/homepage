
export function onRequest({ request, env }) {
  const upgradeHeader = request.headers.get('Upgrade')
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 })
  }

  const [client, server] = Object.values(new WebSocketPair())
  server.accept()

  const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9&compress=zlib-stream')
  ws.addEventListener('message', ({ data }) => server.send(data))
  ws.addEventListener('close', () => server.close())
  ws.addEventListener('error', () => server.close())
  ws.addEventListener('open', () => {
    setInterval(() => ws.send(`{"op":1,"d":6}`), 40000)
    ws.send(`{"op":2,"d":{"token":"${env.MJ_TOKEN}","intents":512,"properties":{"os":"Mac OS X","browser":"Chrome","device":""},"compress":true}}`)
  })

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}