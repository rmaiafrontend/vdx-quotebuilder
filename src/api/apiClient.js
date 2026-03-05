/**
 * HTTP client for the back-end API.
 * Paths are full paths (e.g. /api/configuracao/categorias).
 * Base URL has no trailing slash (e.g. http://177.73.87.130:9090).
 *
 * Suporta tokenScope para autenticacao dual:
 *   'admin'      → usa admin_token do localStorage
 *   'vidraceiro' → usa vidraceiro_token do localStorage
 *   'public'     → sem header Authorization
 *   undefined    → tenta admin_token, depois vidraceiro_token (fallback)
 */

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeaders(tokenScope) {
  if (typeof window === 'undefined' || !window.localStorage) return {};

  if (tokenScope === 'public') return {};

  let token;
  if (tokenScope === 'admin') {
    token = window.localStorage.getItem('admin_token');
  } else if (tokenScope === 'vidraceiro') {
    token = window.localStorage.getItem('vidraceiro_token');
  } else {
    token = window.localStorage.getItem('admin_token') || window.localStorage.getItem('vidraceiro_token');
  }

  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function buildUrl(path, params = {}) {
  const url = new URL(path, baseURL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => ({})) : await response.text().catch(() => '');

  if (!response.ok) {
    const message = (body && typeof body === 'object' && body.message) ? body.message : body || response.statusText;
    const err = new Error(typeof message === 'string' ? message : `HTTP ${response.status}`);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

function defaultHeaders(tokenScope, extra = {}) {
  return {
    Accept: 'application/json',
    ...getAuthHeaders(tokenScope),
    ...extra
  };
}

export const apiClient = {
  get(path, { params, tokenScope } = {}) {
    const url = buildUrl(path, params || {});
    return fetch(url, {
      method: 'GET',
      headers: defaultHeaders(tokenScope)
    }).then(handleResponse);
  },

  post(path, body, { tokenScope } = {}) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'POST',
      headers: defaultHeaders(tokenScope, { 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  put(path, body, { tokenScope } = {}) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'PUT',
      headers: defaultHeaders(tokenScope, { 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  patch(path, body, { tokenScope } = {}) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'PATCH',
      headers: defaultHeaders(tokenScope, { 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  delete(path, { tokenScope } = {}) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'DELETE',
      headers: defaultHeaders(tokenScope)
    }).then(handleResponse);
  },

  upload(path, file, { tokenScope } = {}) {
    const url = buildUrl(path);
    const formData = new FormData();
    formData.append('file', file);
    return fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(tokenScope),
      body: formData
    }).then(handleResponse);
  }
};
