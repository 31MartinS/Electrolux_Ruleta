import { useRef, useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// Nombres de los premios (sin emojis)
const premios = [
  "Medio año de detergente gratis",
  "Regalo sorpresa",
  "Aspiradora",
  "Regalo sorpresa",
  "Regalo sorpresa",
  "Plancha",
  "Medio año de detergente gratis",
  "Regalo sorpresa"
];

const colores = ["#D3DCE1", "#1F2045"];

export default function SpinWheel() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [girando, setGirando] = useState(false);
  const [premioTexto, setPremioTexto] = useState('');
  const [confetiVisible, setConfetiVisible] = useState(false);

  const segmentos = premios.length;
  const centro = 200;

  // Crear un solo objeto Audio
  const sonidoGiro = useRef(new Audio('/audio/rulet.mp3')).current;
  const sonidoFin  = useRef(new Audio('/audio/win.mp3')).current;

  // Mezclar premios aleatoriamente
  const premiosAsignados = [...premios].sort(() => Math.random() - 0.5);

  const dibujar = (ctx, angulo) => {
    const angSeg = (2 * Math.PI) / segmentos;
    ctx.clearRect(0, 0, centro * 2, centro * 2);
    ctx.save();
    ctx.translate(centro, centro);
    ctx.rotate((angulo * Math.PI) / 180);
    ctx.translate(-centro, -centro);

    const offset = ((angulo % 360) * Math.PI) / 180;
    const activo = (segmentos - Math.floor((offset / (2 * Math.PI)) * segmentos)) % segmentos;

    // Dibujar segmentos
    for (let i = 0; i < segmentos; i++) {
      ctx.beginPath();
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, centro, i * angSeg, (i + 1) * angSeg);
      ctx.fillStyle = i === activo ? "#7FDBFF" : colores[i % 2];
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

    // Dibujar texto de premios con fuente Electrolux y tamaño reducido
    ctx.save();
    ctx.translate(centro, centro);
    for (let i = 0; i < segmentos; i++) {
      ctx.save();
      const a = i * angSeg + angSeg / 2;
      ctx.rotate(a);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      // Usar Electrolux
      ctx.font = "bold 14px Electrolux";
      
      const fullText = premiosAsignados[i];
      let lines = [];
      if (fullText.length > 14) {
        const words = fullText.split(' ');
        let line1 = '', line2 = '';
        words.forEach(word => {
          if ((line1 + word).length <= 14) line1 += word + ' ';
          else line2 += word + ' ';
        });
        lines = [line1.trim(), line2.trim()];
      } else {
        lines = [fullText];
      }

      lines.forEach((textLine, idx) => {
        const yOffset = (idx - (lines.length - 1) / 2) * 16;
        ctx.fillText(textLine, centro - 60, yOffset);
      });
      ctx.restore();
    }
    ctx.restore();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    dibujar(ctx, 0);
    containerRef.current.classList.remove("opacity-0", "scale-50");
  }, []);

  const girarRuleta = () => {
    if (girando) return;
    setGirando(true);
    setPremioTexto('');
    setConfetiVisible(false);

    sonidoGiro.currentTime = 0;
    sonidoGiro.play();

    // Duración aumentada a 8 segundos
    const duracion = 8000;
    const vueltas  = 360 * 5;
    const random   = Math.random() * 360;
    const destino  = vueltas + random;
    const inicio   = performance.now();

    const animar = (ahora) => {
      const delta = ahora - inicio;
      const prog  = Math.min(delta / duracion, 1);
      const ease  = 1 - Math.pow(1 - prog, 3);
      const ang   = destino * ease;

      const ctx = canvasRef.current.getContext("2d");
      dibujar(ctx, ang);

      if (prog < 1) {
        requestAnimationFrame(animar);
      } else {
        sonidoGiro.pause();
        sonidoGiro.currentTime = 0;
        sonidoFin.currentTime = 0;
        sonidoFin.play();

        setGirando(false);
        const final = (ang % 360 + 360) % 360;
        const angSegmento = 360 / segmentos;
        const index = (segmentos - Math.floor(final / angSegmento)) % segmentos;
        const premioSeleccionado = premiosAsignados[index];

        setPremioTexto(premioSeleccionado);
        setConfetiVisible(true);
      }
    };

    requestAnimationFrame(animar);
  };

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: 'Electrolux, sans-serif' }}
      className="flex flex-col items-center justify-center min-h-screen bg-dynamic opacity-0 scale-50 transition-all duration-700 ease-out"
    >
      {confetiVisible && <Confetti />}
      <div className="relative flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-full shadow-2xl border-8 border-[#2F3153]"
          style={{ fontFamily: 'Electrolux, sans-serif' }}
        />

        {/* Cuadro emergente con mensaje bonito, centrado */}
        {premioTexto && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg text-center z-10">
            <h2 className="text-3xl font-bold mb-2 text-green-600">¡Felicidades!</h2>
            <p className="text-lg">{`Has ganado: ${premioTexto}`}</p>
          </div>
        )}

        <button
          onClick={girarRuleta}
          disabled={girando}
          className="mt-6 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white font-bold rounded-full transition-colors disabled:bg-[var(--color-light)] disabled:cursor-not-allowed"
        >
          {girando ? 'Girando...' : '¡Girar Ruleta!'}
        </button>
      </div>
    </div>
  );
}