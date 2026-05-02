// ============================================================
// lib/api.ts  —  Axios instance with full interceptor chain
// ============================================================
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000') + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

// ── Request interceptor — attach Bearer token ────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      const lang = localStorage.getItem('lang') ?? 'fr'
      config.headers['Accept-Language'] = lang
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle global errors ──────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('adminName')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (error.response?.status === 503 || !error.response) {
        console.error('API unreachable:', error.message)
      }
    }

    return Promise.reject(error)
  }
)

export default api

// ── Helper: extract error messages from API response ─────────
export function extractApiErrors(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Une erreur est survenue.'

  const axiosError = error as AxiosError<{ errors?: Record<string, string[]> | string[] }>
  const errors = axiosError.response?.data?.errors

  if (!errors) return 'Une erreur est survenue.'

  if (Array.isArray(errors)) return errors.join(' ')

  return Object.values(errors)
    .flat()
    .join(' ')
}

// ── ✅ Helper: download PDF (FIXED VERSION) ───────────────────
export async function downloadPdf(url: string, filename: string): Promise<void> {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    })

    const contentType = response.headers['content-type']

    // ❗ إذا لم يكن PDF → نعرض الخطأ الحقيقي
    if (!String(contentType).includes('application/pdf')) {
      const text = await response.data.text()
      console.error('PDF error response:', text)
      alert('Erreur lors de la génération du PDF. Voir la console.')
      return
    }

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    })

    const fileUrl = window.URL.createObjectURL(blob)

    // تحميل الملف
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(fileUrl)
  } catch (error) {
    console.error('Download PDF error:', error)
    alert('Erreur lors du téléchargement du PDF.')
  }
}