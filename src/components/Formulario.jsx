import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarParticipante } from '../services/firebase';
import '../styles/form.css';

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    celular: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validaciones
  const validarNombre = (nombre) =>
    /^([A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})+$/.test(
      nombre.trim()
    );

  const validarCedula = (cedula) => /^\d{10}$/.test(cedula);

  const validarCelular = (celular) => /^09\d{8}$/.test(celular);

  const validarEmail = (email) =>
    /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, cedula, celular, email } = formData;

    if (!nombre || !cedula || !celular || !email) {
      return setError('Todos los campos son obligatorios.');
    }
    if (!validarNombre(nombre)) {
      return setError('Nombre inválido. Usa solo letras y al menos dos palabras.');
    }
    if (!validarCedula(cedula)) {
      return setError('La cédula debe tener exactamente 10 dígitos numéricos.');
    }
    if (!validarCelular(celular)) {
      return setError('El celular debe tener 10 dígitos y comenzar con 09.');
    }
    if (!validarEmail(email)) {
      return setError('Correo electrónico inválido.');
    }

    try {
      setLoading(true);
      await guardarParticipante(formData);
      sessionStorage.setItem('emailParticipante', email);
      navigate('/spin');
    } catch (err) {
      setError(err.message || 'Error al guardar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      <h2>¡Participa y gana premios!</h2>

      <label htmlFor="nombre">
        <strong>Nombre completo</strong>
      </label>
      <input
        id="nombre"
        name="nombre"
        placeholder="Ej. Juan Pérez"
        value={formData.nombre}
        onChange={handleChange}
        required
        autoComplete="name"
      />

      <label htmlFor="cedula">
        <strong>Cédula</strong>
      </label>
      <input
        id="cedula"
        name="cedula"
        placeholder="Ej. 0912345678"
        value={formData.cedula}
        onChange={handleChange}
        required
        inputMode="numeric"
        pattern="\d{10}"
      />

      <label htmlFor="celular">
        <strong>Celular</strong>
      </label>
      <input
        id="celular"
        name="celular"
        placeholder="Ej. 0998765432"
        value={formData.celular}
        onChange={handleChange}
        required
        inputMode="numeric"
        pattern="09\d{8}"
      />

      <label htmlFor="email">
        <strong>Correo electrónico</strong>
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Ej. correo@ejemplo.com"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? <span className="spinner"></span> : 'Continuar'}
      </button>
    </form>
  );
}
