import Formulario from '../components/Formulario'
import backgroundImage from '../assets/images/moms.jpg'

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Contenido centrado */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Branding opcional / título de la campaña */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              Promoción especial
            </span>
          </div>

          <Formulario />
        </div>
      </div>
    </div>
  )
}
