import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="app-shell">
      <h1>AI-assisted TDD demo scaffold</h1>
      <p>
        This installable shell is intentionally light on implementation so the
        homepage, API integration, and tests can be built incrementally with
        TDD.
      </p>
    </main>
  </StrictMode>,
)
