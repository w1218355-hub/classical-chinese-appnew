import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'
import App from './App.tsx'
import './index.css'

// 给面试官的特殊链接标记：?ref=协恩
const params = new URLSearchParams(window.location.search)
if (params.get('ref') === '协恩') {
  track('interviewer_visit', { source: '协恩面试官' })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
