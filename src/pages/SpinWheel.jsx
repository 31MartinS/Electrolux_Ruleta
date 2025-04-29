import { useRef, useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const premios = [
  "🧼","🎁","🧹","🎁","🎁","🔥","🧴","🎁"
];

const significadoPremios = {
  "🧼": "Detergente gratis por 6 meses",
  "🧴": "Detergente gratis por 6 meses",
  "🎁": "Regalo sorpresa",
  "🧹": "Aspiradora",
  "🔥": "Plancha"
};

const colores = ["#D3DCE1","#1F2045"];

export default function SpinWheel() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [girando, setGirando] = useState(false);
  const [premio, setPremio] = useState('');
  const [premioTexto, setPremioTexto] = useState('');
  const [confetiVisible, setConfetiVisible] = useState(false);

  const segmentos = 8;
  const centro = 200;

  // Crear un solo objeto Audio
  const sonidoGiro = useRef(new Audio('/audio/rulet.mp3')).current;
  const sonidoFin  = useRef(new Audio('/audio/win.mp3')).current;

  const premiosAsignados = [...premios].sort(() => Math.random() - 0.5);

  const dibujar = (ctx, angulo) => {
    const angSeg = 2 * Math.PI / segmentos;
    ctx.clearRect(0, 0, centro * 2, centro * 2);
    ctx.save();
    ctx.translate(centro, centro);
    ctx.rotate(angulo * Math.PI / 180);
    ctx.translate(-centro, -centro);

    const offset = (angulo % 360) * Math.PI / 180;
    const activo = (segmentos - Math.floor((offset / (2 * Math.PI)) * segmentos)) % segmentos;

    for (let i = 0; i < segmentos; i++) {
      ctx.beginPath();
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, centro, i * angSeg, (i+1)*angSeg);
      ctx.fillStyle = i === activo ? "#7FDBFF" : colores[i % 2];
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(centro, centro);
    for (let i = 0; i < segmentos; i++) {
      ctx.save();
      const a = i * angSeg + angSeg/2;
      ctx.rotate(a);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 30px ElectroluxSans";
      ctx.fillText(premiosAsignados[i], centro - 60, 0);
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
    setPremio('');
    setPremioTexto('');
    setConfetiVisible(false);

    // Reproducir el sonido de giro solo durante la animación
    sonidoGiro.currentTime = 0;
    sonidoGiro.play();

    const duracion = 4000;
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
        // Al terminar el giro, paramos el sonido de giro y arrancamos el de victoria
        sonidoGiro.pause();
        sonidoGiro.currentTime = 0;
        sonidoFin.currentTime = 0;
        sonidoFin.play();

        setGirando(false);

        const final = (ang % 360 + 360) % 360;
        const angSegmento = 360 / segmentos;
        const index = (segmentos - Math.floor(final / angSegmento)) % segmentos;
        const emojiGanador = premiosAsignados[index];

        setPremio('¡Ganaste!');
        setPremioTexto(significadoPremios[emojiGanador] || 'Premio desconocido');
        setConfetiVisible(true);
      }
    };

    requestAnimationFrame(animar);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-dynamic opacity-0 scale-50 transition-all duration-700 ease-out"
    >
      {confetiVisible && <Confetti />}
      <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-full shadow-2xl border-8 border-[#2F3153]"
        />
        <button
          onClick={girarRuleta}
          disabled={girando}
          className="mt-6 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white font-bold rounded-full transition-colors disabled:bg-[var(--color-light)] disabled:cursor-not-allowed"
        >
          {girando ? 'Girando...' : '¡Girar Ruleta!'}
        </button>
        {premio && (
          <>
            <div className="mt-6 text-2xl font-semibold text-[var(--color-primary)]">
              {premio}
            </div>
            <div className="mt-2 text-lg">
              {premioTexto}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
