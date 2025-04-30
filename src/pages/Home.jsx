import Formulario from '../components/Formulario'
import backgroundImage from '../assets/images/moms.jpg'

export default function Home() {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-4">
        <Formulario />
      </div>
    </div>
  )
}
 