
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Hmm~~~?', { status: 404, statusText: 'Not Found.' })

  const chat = await request.json()
  const { body, headers, status, statusText } = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      temperature: 0.6,
      ...chat
    }),
    headers: {
      'Authorization': `Bearer ${env.GPT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  return new Response(body, { status, statusText, headers })
}
