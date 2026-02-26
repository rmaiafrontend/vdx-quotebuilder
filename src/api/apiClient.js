/**
 * HTTP client for the back-end API.
 * Paths are full paths per Documentacao_API.pdf (e.g. /api/configuracao/categorias).
 * Base URL has no trailing slash (e.g. http://177.73.87.130:9090).
 * Envia Authorization: Bearer <token> quando há token em localStorage (app_access_token ou token).
 */

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeaders() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  const token = window.localStorage.getItem('app_access_token') || window.localStorage.getItem('token');
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

function defaultHeaders(extra = {}) {
  return {
    Accept: 'application/json',
    ...getAuthHeaders(),
    ...extra
  };
}

export const apiClient = {
  get(path, { params } = {}) {
    const url = buildUrl(path, params || {});
    return fetch(url, {
      method: 'GET',
      headers: defaultHeaders()
    }).then(handleResponse);
  },

  post(path, body) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'POST',
      headers: defaultHeaders({ 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  put(path, body) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'PUT',
      headers: defaultHeaders({ 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  patch(path, body) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'PATCH',
      headers: defaultHeaders({ 'Content-Type': 'application/json' }),
      body: body != null ? JSON.stringify(body) : undefined
    }).then(handleResponse);
  },

  delete(path) {
    const url = buildUrl(path);
    return fetch(url, {
      method: 'DELETE',
      headers: defaultHeaders()
    }).then(handleResponse);
  },

  /**
   * Upload de arquivo (multipart). Não define Content-Type para o browser definir boundary.
   * @param {string} path - ex: /api/upload
   * @param {File} file
   * @returns {Promise<object>} - ex: { file_url }
   */
  upload(path, file) {
    const url = buildUrl(path);
    const formData = new FormData();
    formData.append('file', file);
    return fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    }).then(handleResponse);
  }
};
