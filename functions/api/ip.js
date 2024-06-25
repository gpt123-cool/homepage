
export function onRequest({ request, env }) {
  return fetch('https://ifconfig.me');
}