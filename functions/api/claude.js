const url = 'https://osp5kg3kbdoi4oza53viqlrggu0vtjjl.lambda-url.us-east-1.on.aws'

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Hmm~~~?', { status: 404, statusText: 'Not Found.' })

  return await fetch(url, request);
}