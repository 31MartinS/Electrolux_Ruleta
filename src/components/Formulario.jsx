import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarParticipante } from '../services/firebase'

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    celular: '',
    email: '',
  })
  const [touched, setTouched] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // === Validaciones ===
  const validarNombre = (v) =>
    /^([A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})+$/.test(v.trim())

  // Algoritmo oficial para cédula ECU (módulo 10)
  const validarCedulaEC = (ced) => {
    if (!/^\d{10}$/.test(ced)) return false
    const provincia = parseInt(ced.slice(0, 2), 10)
    if (provincia < 1 || provincia > 24) return false
    const tercer = parseInt(ced[2], 10)
    if (tercer >= 6) return false

    const coef = [2,1,2,1,2,1,2,1,2]
    const sum = coef.reduce((acc, c, i) => {
      let prod = c * parseInt(ced[i], 10)
      if (prod >= 10) prod -= 9
      return acc + prod
    }, 0)
    const verificador = (10 - (sum % 10)) % 10
    return verificador === parseInt(ced[9], 10)
  }

  const validarCelular = (v) => /^09\d{8}$/.test(v)

  const validarEmail = (v) =>
    /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v.trim())

  const getFieldError = (name, value) => {
    if (!value) return 'Campo obligatorio.'
    if (name === 'nombre' && !validarNombre(value)) {
      return 'Ingresa nombre y apellido(s) solo con letras.'
    }
    if (name === 'cedula' && !validarCedulaEC(value)) {
      return 'Cédula inválida para Ecuador.'
    }
    if (name === 'celular' && !validarCelular(value)) {
      return 'Debe iniciar con 09 y tener 10 dígitos.'
    }
    if (name === 'email' && !validarEmail(value)) {
      return 'Correo electrónico inválido.'
    }
    return ''
  }

  const isFormValid = () => {
    return (
      validarNombre(formData.nombre) &&
      validarCedulaEC(formData.cedula) &&
      validarCelular(formData.celular) &&
      validarEmail(formData.email)
    )
  }

  // === Handlers ===
  const handleChange = (e) => {
    const { name, value } = e.target
    // Sanitiza numéricos
    const sanitized =
      name === 'cedula' || name === 'celular'
        ? value.replace(/\D/g, '')
        : value

    setFormData((f) => ({ ...f, [name]: sanitized }))
    setError('')
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Marca todos como tocados para mostrar errores si los hubiera
    setTouched({ nombre: true, cedula: true, celular: true, email: true })

    if (!isFormValid()) {
      setError('Revisa los campos marcados en rojo.')
      return
    }

    try {
      setLoading(true)
      await guardarParticipante(formData)
      sessionStorage.setItem('emailParticipante', formData.email)
      navigate('/spin')
    } catch (err) {
      setError(err?.message || 'Error al guardar los datos.')
      setLoading(false)
    }
  }

  // === UI helpers ===
  const Field = ({ id, label, children, hint, errorMsg }) => (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-white/90 tracking-wide"
      >
        {label}
      </label>
      {children}
      {errorMsg ? (
        <p className="text-xs text-red-300">{errorMsg}</p>
      ) : hint ? (
        <p className="text-xs text-white/60">{hint}</p>
      ) : null}
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
      aria-describedby={error ? 'form-error' : undefined}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-white drop-shadow-sm">
          Participa y gana premios
        </h2>
        <p className="text-sm text-white/70">
          Llena tus datos para ingresar al sorteo
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl p-5 sm:p-6 space-y-4">
        {/* Nombre */}
        <Field
          id="nombre"
          label="Nombre completo"
          hint="Ej. Juan Pérez"
          errorMsg={touched.nombre ? getFieldError('nombre', formData.nombre) : ''}
        >
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej. Juan Pérez"
            autoComplete="name"
            className={`w-full rounded-xl bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none ring-2 transition
            ${touched.nombre && getFieldError('nombre', formData.nombre)
              ? 'ring-red-400 focus:ring-red-400'
              : 'ring-transparent focus:ring-indigo-400'}`}
          />
        </Field>

        {/* Cédula */}
        <Field
          id="cedula"
          label="Cédula"
          hint="10 dígitos"
          errorMsg={touched.cedula ? getFieldError('cedula', formData.cedula) : ''}
        >
          <input
            id="cedula"
            name="cedula"
            inputMode="numeric"
            pattern="\d*"
            maxLength={10}
            value={formData.cedula}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0912345678"
            className={`w-full rounded-xl bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none ring-2 transition
            ${touched.cedula && getFieldError('cedula', formData.cedula)
              ? 'ring-red-400 focus:ring-red-400'
              : 'ring-transparent focus:ring-indigo-400'}`}
          />
        </Field>

        {/* Celular */}
        <Field
          id="celular"
          label="Celular"
          hint="Debe iniciar con 09"
          errorMsg={touched.celular ? getFieldError('celular', formData.celular) : ''}
        >
          <input
            id="celular"
            name="celular"
            inputMode="numeric"
            pattern="\d*"
            maxLength={10}
            value={formData.celular}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0998765432"
            autoComplete="tel"
            className={`w-full rounded-xl bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none ring-2 transition
            ${touched.celular && getFieldError('celular', formData.celular)
              ? 'ring-red-400 focus:ring-red-400'
              : 'ring-transparent focus:ring-indigo-400'}`}
          />
        </Field>

        {/* Correo */}
        <Field
          id="email"
          label="Correo electrónico"
          hint="Ej. correo@ejemplo.com"
          errorMsg={touched.email ? getFieldError('email', formData.email) : ''}
        >
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            className={`w-full rounded-xl bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none ring-2 transition
            ${touched.email && getFieldError('email', formData.email)
              ? 'ring-red-400 focus:ring-red-400'
              : 'ring-transparent focus:ring-indigo-400'}`}
          />
        </Field>

        {/* Mensaje de error global */}
        {error && (
          <div
            id="form-error"
            className="rounded-lg border border-red-300/60 bg-red-50/80 text-red-800 text-sm px-3 py-2"
          >
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Guardando...
            </span>
          ) : (
            'Continuar'
          )}
        </button>

        <p className="text-[11px] text-white/60 text-center">
          Al continuar aceptas los términos del sorteo y nuestra política de privacidad.
        </p>
      </div>
    </form>
  )
}
