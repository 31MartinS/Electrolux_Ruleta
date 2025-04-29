// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SpinWheel from './pages/SpinWheel'

export default function App() {
  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página de inicio con el formulario */}
        <Route path="/spin" element={<SpinWheel />} /> {/* Página con la ruleta */}
      </Routes>
    </div>
  )
}
