// const url = 'https://api.openai.com/v1/chat/completions'
const url = 'https://api.gpt123.cool/v1/chat/completions'

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Hmm~~~?', { status: 404, statusText: 'Not Found.' })
  const authorization = request.headers.get('Authorization')

  const chat = await request.json()
  const { body, headers, status, statusText } = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      temperature: 0.6,
      ...chat
    }),
    headers: {
      'Authorization': authorization || `Bearer ${env.GPT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  return new Response(body, { status, statusText, headers })
}
