import { useState } from 'react';
import { asignarPremio } from '../services/firebase';
import '../styles/ruleta.css';

function Ruleta() {
  const [girando, setGirando] = useState(false);
  const [premioGanado, setPremioGanado] = useState(null);

  const premios = [
    "Electromenor",
    "Detergente",
    "Regalo sorpresa",
    "Regalo sorpresa",
    "Regalo sorpresa",
  ];

  const colores = ['#D3DCE1', '#1F2045'];

  const girarRuleta = () => {
    if (girando) return;
    setGirando(true);

    const grados = 360 * 5 + Math.floor(Math.random() * 360); // 5 vueltas + random
    const duracion = 5000; // 5 segundos

    const ruleta = document.querySelector('.ruleta');
    ruleta.style.transition = `transform ${duracion}ms ease-out`;
    ruleta.style.transform = `rotate(${grados}deg)`;

    setTimeout(async () => {
      const gradosFinales = grados % 360;
      const sector = Math.floor((gradosFinales / 360) * premios.length);
      const premio = premios[(premios.length - sector) % premios.length];
      setPremioGanado(premio);
      setGirando(false);

      try {
        const email = sessionStorage.getItem('emailParticipante');
        if (email) {
          await asignarPremio(email, premio);
        }
      } catch (error) {
        console.error('Error asignando premio:', error);
      }
    }, duracion);
  };

  return (
    <div className="ruleta-container">
      <div className="ruleta" onClick={girarRuleta}>
        {/* Renderizar sectores de ruleta */}
        {premios.map((premio, i) => (
          <div 
            key={i} 
            className="sector" 
            style={{
              backgroundColor: colores[i % colores.length],
              transform: `rotate(${(360 / premios.length) * i}deg) skewY(-60deg)`
            }}
          >
            <span>{premio}</span>
          </div>
        ))}
      </div>

      {premioGanado && (
        <div className="resultado">
          <h2>¡Ganaste: {premioGanado}!</h2>
        </div>
      )}
    </div>
  );
}

export default Ruleta;
