/**
 * Cloudflare Pages Function Proxy cho Replicate API
 * Route: /replicate-api/* -> https://api.replicate.com/*
 */
export async function onRequest(context) {
  const { request, params } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const subpath = Array.isArray(params.path) ? params.path.join('/') : (params.path || '');
  const url = new URL(request.url);
  const targetUrl = `https://api.replicate.com/${subpath}${url.search}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('host');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error', message: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
