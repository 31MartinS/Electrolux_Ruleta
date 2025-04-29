// src/components/Formulario.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // Importar useNavigate
import { guardarParticipante } from '../services/firebase'
import '../styles/form.css'

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '', cedula: '', celular: '', email: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()  // Inicializar useNavigate

  const validarEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validarCedula = c => /^\d{8,10}$/.test(c)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.nombre || !formData.cedula || !formData.celular || !formData.email) {
      return setError('Completa todos los campos.')
    }
    if (!validarEmail(formData.email)) {
      return setError('Email inválido.')
    }
    if (!validarCedula(formData.cedula)) {
      return setError('Cédula inválida (8–10 dígitos).')
    }

    try {
      await guardarParticipante(formData)
      sessionStorage.setItem('emailParticipante', formData.email)  // Guarda el email en sessionStorage
      navigate('/spin')  // Redirigir a la página de la ruleta
    } catch (err) {
      setError(err.message || 'Error al guardar.')
    }
  }

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>¡Bienvenido!</h2>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="cedula" placeholder="Cédula" onChange={handleChange} />
      <input name="celular" placeholder="Celular" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Continuar</button>
    </form>
  )
}
