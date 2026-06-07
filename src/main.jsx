import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { WorldCupProvider } from './context/WorldCupContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorldCupProvider>
      <App />
    </WorldCupProvider>
  </StrictMode>,
)
