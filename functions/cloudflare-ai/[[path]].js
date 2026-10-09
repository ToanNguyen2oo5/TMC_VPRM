/**
 * Cloudflare Pages Function Proxy cho Cloudflare Workers AI
 * Route: /cloudflare-ai/* -> https://api.cloudflare.com/*
 * Giúp khắc phục triệt để lỗi CORS khi gọi API Cloudflare từ trình duyệt và hỗ trợ bảo mật token.
 */
export async function onRequest(context) {
  const { request, params, env } = context;

  // Xử lý CORS preflight nếu có
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Lấy đường dẫn con sau /cloudflare-ai/
  const subpath = Array.isArray(params.path) ? params.path.join('/') : (params.path || '');
  const url = new URL(request.url);
  const targetUrl = `https://api.cloudflare.com/${subpath}${url.search}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('host');

  // Ưu tiên token nếu được cấu hình trong biến môi trường của Cloudflare Pages
  if (env && env.CF_API_TOKEN && !requestHeaders.get('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${env.CF_API_TOKEN}`);
  }

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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
