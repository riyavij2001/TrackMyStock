import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider } from '@heroui/react'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <main className='dark'>

      <App />
      </main>
    </HeroUIProvider>
  </StrictMode>,
)
