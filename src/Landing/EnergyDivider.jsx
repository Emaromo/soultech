import React from "react";

const EnergyDivider = () => {
  return (
    <div className="relative w-full h-[5px] overflow-hidden my-12">
      <div className="energy-line"></div>

      <style>
        {`
          /* === Línea de Energía Multicolor Dinámica — Soul Tech === */
          .energy-line {
            position: absolute;
            top: 0;
            left: -50%;
            width: 200%;
            height: 100%;
            border-radius: 12px;
            background: linear-gradient(
              90deg,
              #8b5cf6,
              #facc15,
              #22c55e,
              #3b82f6,
              #8b5cf6
            );
            background-size: 300% 100%;
            animation: 
              energyFlow 5s linear infinite,
              colorCycle 8s ease-in-out infinite,
              pulseGlow 3s ease-in-out infinite;
            box-shadow:
              0 0 12px rgba(139,92,246,0.6),
              0 0 30px rgba(59,130,246,0.3),
              0 0 60px rgba(34,197,94,0.2);
          }

          /* Flujo continuo del gradiente */
          @keyframes energyFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Ciclo de cambio de color progresivo */
          @keyframes colorCycle {
            0% {
              background: linear-gradient(90deg, #8b5cf6, #facc15, #22c55e, #3b82f6, #8b5cf6);
              box-shadow:
                0 0 10px #8b5cf6,
                0 0 20px #3b82f6;
            }
            25% {
              background: linear-gradient(90deg, #facc15, #22c55e, #3b82f6, #8b5cf6, #facc15);
              box-shadow:
                0 0 10px #facc15,
                0 0 25px #22c55e;
            }
            50% {
              background: linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6, #facc15, #22c55e);
              box-shadow:
                0 0 12px #22c55e,
                0 0 28px #3b82f6;
            }
            75% {
              background: linear-gradient(90deg, #3b82f6, #8b5cf6, #facc15, #22c55e, #3b82f6);
              box-shadow:
                0 0 14px #3b82f6,
                0 0 30px #8b5cf6;
            }
            100% {
              background: linear-gradient(90deg, #8b5cf6, #facc15, #22c55e, #3b82f6, #8b5cf6);
              box-shadow:
                0 0 12px #8b5cf6,
                0 0 28px #3b82f6;
            }
          }

          /* Pulso sutil de energía */
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.9;
              transform: scaleY(1);
              filter: brightness(1.1);
            }
            50% {
              opacity: 1;
              transform: scaleY(1.3);
              filter: brightness(1.4);
            }
          }
        `}
      </style>
    </div>
  );
};

export default EnergyDivider;
