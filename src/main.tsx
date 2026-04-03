import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Welcome } from '@/pages/Welcome'
import { Onboarding } from '@/pages/Onboarding'
import { Builder } from '@/pages/Builder'
import { NotFound } from '@/pages/NotFound'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/new-project" element={<Onboarding />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
