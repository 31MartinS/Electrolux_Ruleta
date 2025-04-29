import Formulario from '../components/Formulario';
import backgroundImage from '../assets/images/moms.jpg';  // Asegúrate de que la imagen esté en esta ruta

export default function Home() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}  // Usa la imagen importada
    >
      <div className=" p-8 rounded-xl max-w-lg w-full">
        <Formulario />
      </div>
    </div>
  );
}
