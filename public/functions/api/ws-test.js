
export function onRequest(context) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://ws.gpt123.cool/?encoding=json&v=9')
    ws.addEventListener('open', () => {
      resolve(new Response('OK'))
    })
    
    setTimeout(reject, 5000)
  })
}