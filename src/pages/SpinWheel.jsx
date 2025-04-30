import { useRef, useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import TitleImg from '../assets/images/Title.png';
import { asignarPremio } from '../services/firebase';

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
  const [premiosAsignados, setPremiosAsignados] = useState([]);
  const [finalIndex, setFinalIndex] = useState(null);

  const segmentos = premios.length;
  const centro = 200;

  const sonidoGiro = useRef(new Audio('/audio/rulet.mp3')).current;
  const sonidoFin = useRef(new Audio('/audio/win.mp3')).current;

  const emailParticipante = sessionStorage.getItem('emailParticipante');

  useEffect(() => {
    const mezclados = [...premios].sort(() => Math.random() - 0.5);
    setPremiosAsignados(mezclados);
    const ctx = canvasRef.current.getContext('2d');
    dibujar(ctx, 0, mezclados, null);
    containerRef.current.classList.remove('opacity-0', 'scale-50');
  }, []);

  const dibujar = (ctx, angulo, premiosActuales, highlightIndex) => {
    const angSeg = (2 * Math.PI) / segmentos;
    ctx.clearRect(0, 0, centro * 2, centro * 2);
    ctx.save();
    ctx.translate(centro, centro);
    ctx.rotate((angulo * Math.PI) / 180);
    ctx.translate(-centro, -centro);

    for (let i = 0; i < segmentos; i++) {
      const start = i * angSeg;
      const end = (i + 1) * angSeg;

      ctx.beginPath();
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, centro, start, end);
      ctx.fillStyle = colores[i % 2];
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, centro, start, end);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'white';
      ctx.stroke();

      if (highlightIndex === i) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'rgb(255, 69, 0)';
        ctx.shadowColor = 'rgb(255, 140, 0)';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(centro, centro);
        ctx.arc(centro, centro, centro, start, end);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(centro, centro);
    for (let i = 0; i < segmentos; i++) {
      ctx.save();
      const a = i * angSeg + angSeg / 2;
      ctx.rotate(a);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px ElectroluxSans_Bold, Electrolux, sans-serif';

      const fullText = premiosActuales[i];
      const lines = fullText.length > 14 ? splitText(fullText, 14) : [fullText];
      lines.forEach((textLine, idx) => {
        const yOffset = (idx - (lines.length - 1) / 2) * 16;
        ctx.fillText(textLine, centro - 60, yOffset);
      });
      ctx.restore();
    }
    ctx.restore();
    ctx.restore();
  };

  const splitText = (text, maxLen) => {
    const words = text.split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach(word => {
      if ((line1 + word).length <= maxLen) line1 += word + ' ';
      else line2 += word + ' ';
    });
    return [line1.trim(), line2.trim()];
  };

  const girarRuleta = () => {
    if (girando) return;
    setGirando(true);
    setPremioTexto('');
    setConfetiVisible(false);
    setFinalIndex(null);

    sonidoGiro.currentTime = 0;
    sonidoGiro.play();

    const duracion = 8000;
    const vueltas = 360 * 5;
    const randomIndex = Math.floor(Math.random() * segmentos);
    const anguloSegmento = 360 / segmentos;
    const offset = -90 - (randomIndex * anguloSegmento + anguloSegmento / 2);
    const destino = vueltas + offset;

    const inicio = performance.now();
    const animar = ahora => {
      const delta = ahora - inicio;
      const prog = Math.min(delta / duracion, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const ang = destino * ease;

      const ctx = canvasRef.current.getContext('2d');
      dibujar(ctx, ang, premiosAsignados, null);

      if (prog < 1) {
        requestAnimationFrame(animar);
      } else {
        sonidoGiro.pause();
        sonidoGiro.currentTime = 0;
        sonidoFin.currentTime = 0;
        sonidoFin.play();

        setGirando(false);
        setFinalIndex(randomIndex);
        setPremioTexto(premiosAsignados[randomIndex]);
        setConfetiVisible(true);

        const ctxFinal = canvasRef.current.getContext('2d');
        dibujar(ctxFinal, destino, premiosAsignados, randomIndex);

        if (emailParticipante) {
          asignarPremio(emailParticipante, premiosAsignados[randomIndex])
            .catch(err => console.error('Error al asignar premio:', err));
        }
      }
    };

    requestAnimationFrame(animar);
  };

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: 'ElectroluxSans_Bold, Electrolux, sans-serif' }}
      className="flex flex-col items-center justify-start pt-32 min-h-screen bg-dynamic opacity-0 scale-50 transition-all duration-700 ease-out px-4"
    >
      {confetiVisible && <Confetti />}

      <div className="relative flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl w-full max-w-[500px]">

        {/* LOGO */}
        <img
          src={TitleImg}
          alt="Logo"
          className="w-40 sm:w-52 md:w-64 lg:w-72 mb-6 absolute -top-32 sm:-top-48 md:-top-28 lg:-top-32 left-1/2 transform -translate-x-1/2 drop-shadow-lg"
        />

        {/* FLECHA */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '25px solid #FF5722',
              filter: 'drop-shadow(0 0 10px rgba(255,87,34,0.9))'
            }}
          />
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-[90vw] max-w-[400px] aspect-square rounded-full shadow-2xl border-8 border-[#2F3153] mt-8"
        />

        {/* MENSAJE GANADOR */}
        {premioTexto && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg text-center z-10 max-w-[80%]">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-600">¡Felicidades!</h2>
            <p className="text-base sm:text-lg">{`Has ganado: ${premioTexto}`}</p>
          </div>
        )}

        {/* BOTÓN */}
        <button
          onClick={girarRuleta}
          disabled={girando}
          className="mt-6 px-6 py-3 text-sm sm:text-base bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white font-bold rounded-full transition-colors disabled:bg-[var(--color-light)] disabled:cursor-not-allowed"
        >
          {girando ? 'Girando...' : '¡Girar Ruleta!'}
        </button>
      </div>
    </div>
  );
}