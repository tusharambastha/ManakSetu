/**
 * API client utilities for ManakSetu
 * Prevents WebKit DOMException ("The string did not match the expected pattern")
 * and handles development proxy fallbacks.
 */

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    // If running on GitHub Pages (github.io), forward API requests to live backend
    if (window.location.hostname.endsWith('github.io')) {
      return 'https://navigate-carl-passport-tampa.trycloudflare.com'
    }
    // If the frontend is served on Vite dev server (port 5173), direct the browser
    // to FastAPI directly on port 8000 to bypass sandboxed Vite proxy connect restrictions.
    if (window.location.port === '5173') {
      return `http://${window.location.hostname}:8000`
    }
  }
  return ''
}

export async function safeFetch(url, options = {}) {
  const baseUrl = getApiBaseUrl()
  const targetUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

  let res
  try {
    res = await fetch(targetUrl, options)
  } catch (netErr) {
    // If connection to port 8000 failed and we used baseUrl, attempt fallback to relative URL
    // only if NOT hosted on github.io (where relative API endpoints don't exist)
    if (baseUrl && targetUrl.startsWith(baseUrl) && !window.location.hostname.endsWith('github.io')) {
      try {
        res = await fetch(url, options)
      } catch (fallbackErr) {
        throw new Error(`Unable to connect to ManakSetu backend server. Please ensure the server is running on port 8000. (${netErr.message})`)
      }
    } else {
      throw new Error(`Network error connecting to ManakSetu backend: ${netErr.message}`)
    }
  }

  // Safely parse text first to prevent WebKit/Safari DOMException (SyntaxError) on HTML or proxy errors
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (_) {
      data = null
    }
  }

  if (!res.ok) {
    let errorDetail = data?.detail || data?.message
    if (Array.isArray(errorDetail)) {
      // Pydantic validation error array
      errorDetail = errorDetail.map((e) => (typeof e === 'object' ? e.msg || e.message : String(e))).join('; ')
    }
    if (!errorDetail) {
      if (text && text.length < 200 && !text.includes('<html')) {
        errorDetail = text.trim()
      } else {
        errorDetail = `Request failed with status ${res.status} (${res.statusText || 'Server Error'})`
      }
    }
    throw new Error(errorDetail)
  }

  return data
}
