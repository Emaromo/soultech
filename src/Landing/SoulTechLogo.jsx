import React, { useEffect, useId, useRef } from "react";

/**
 * Logo de Soul Tech — enfoque híbrido: el ESCUDO es el PNG real
 * (/public/soultech1.png, estático, conserva su degradado/volumen 3D
 * original) y la LLAMA se recorta del MISMO PNG con una máscara SVG (el
 * trazado calibrado por superposición, ver FLAME_D) para poder animarla
 * por separado sin recrear a mano el degradado/bisel de la llama real —
 * al ser un recorte de los píxeles reales, calza perfecto a escala 1.
 *
 * Capas (fondo → frente), todas dentro de un único <svg>:
 *   1. <image> del escudo completo, estática, SIN filtro ni animación
 *      (el escudo "no se mueve ni brilla").
 *   2/3/4. Tres copias de ESA MISMA imagen, cada una recortada con la
 *      máscara de la llama y con un solo drop-shadow blanco, animando
 *      radio+opacidad entre "tenue" y "encendido" a su propio ritmo
 *      (1.7s/2.3s/3.1s, no múltiplos entre sí — así el pulso no se
 *      siente mecánico, ver designV2.css).
 *   5. Una cuarta copia recortada, sin blur, encima de todo: es la
 *      llama "nítida" que reemplaza visualmente a la del escudo base
 *      (coincide pixel a pixel en reposo) y es la que de verdad hace el
 *      micro scale 1↔1.04 junto con las tres capas de brillo (mismo
 *      grupo <g>, un cuarto ritmo distinto de los anteriores).
 */

// Tamaño real en el navbar.
const LOGO_SIZE = 48;

// viewBox = coordenadas nativas de soultech1.png (1334x1376 -- el archivo
// real (soultech1.webp) se reencodeó y redujo a 500px de ancho para
// performance mobile (2026-08), pero IMG_W/IMG_H quedan en la resolución
// ORIGINAL a propósito: <image> de SVG escala el source para llenar
// width/height preservando el aspect-ratio (que no cambió, el resize fue
// proporcional), así que el trazado de FLAME_D calibrado por superposición
// sigue calzando exacto sin volver a calibrar nada — mostrado a 38-55px en
// el navbar, 500px de source sigue siendo ~9x oversampling.
const VIEWBOX = "0 0 1334 1376";
const IMG_W = 1334;
const IMG_H = 1376;

// Trazado de la llama: silueta real extraída de soultech1.png (flood-fill
// + contorno Moore-neighbor + simplificación RDP + reconstrucción en
// curvas suaves). Verificado por superposición directa: coincide con la
// silueta al píxel. Se usa como máscara, no como fill — así la llama
// recortada conserva el degradado/bisel real del PNG sin recrearlo.
const FLAME_D =
  "M 703,320 C 704.5,320 709.7,320 711,321 C 712.3,322 716.2,320.5 711,326 C 705.8,331.5 688,344.5 680,354 C 672,363.5 667,373.3 663,383 C 659,392.7 657.2,401.7 656,412 C 654.8,422.3 654.8,434.7 656,445 C 657.2,455.3 660.3,466.2 663,474 C 665.7,481.8 660.8,476.8 672,492 C 683.2,507.2 717.7,548 730,565 C 742.3,582 741.8,583.2 746,594 C 750.2,604.8 753.5,618 755,630 C 756.5,642 757,653.2 755,666 C 753,678.8 750.3,691.8 743,707 C 735.7,722.2 719.5,745.3 711,757 C 702.5,768.7 700.5,769.5 692,777 C 683.5,784.5 667.8,797.2 660,802 C 652.2,806.8 647.8,807.2 645,806 C 642.2,804.8 642.5,801.5 643,795 C 643.5,788.5 647.2,775.8 648,767 C 648.8,758.2 649.3,752.5 648,742 C 646.7,731.5 643.5,714.5 640,704 C 636.5,693.5 631.7,686.3 627,679 C 622.3,671.7 624.3,672.7 612,660 C 599.7,647.3 565.8,616.5 553,603 C 540.2,589.5 539.8,588.5 535,579 C 530.2,569.5 525.5,558.7 524,546 C 522.5,533.3 525,513.5 526,503 C 527,492.5 527.3,491.3 530,483 C 532.7,474.7 537,463.5 542,453 C 547,442.5 553.8,429.7 560,420 C 566.2,410.3 571.7,403.2 579,395 C 586.3,386.8 594.5,378.7 604,371 C 613.5,363.3 625.5,355.3 636,349 C 646.5,342.7 656,337.7 667,333 C 678,328.3 696,323.2 702,321 C 708,318.8 701.5,320 703,320 Z " +
  "M 587,459 C 587.5,460.2 589.2,461.8 590,467 C 590.8,472.2 589.7,481.2 592,490 C 594.3,498.8 598,509.5 604,520 C 610,530.5 615.5,538.5 628,553 C 640.5,567.5 666.8,591.7 679,607 C 691.2,622.3 696.5,633.2 701,645 C 705.5,656.8 705.3,666.8 706,678 C 706.7,689.2 706.5,701.8 705,712 C 703.5,722.2 701.3,729.7 697,739 C 692.7,748.3 682.5,763.5 679,768 C 675.5,772.5 674.8,774.7 676,766 C 677.2,757.3 684.3,728 686,716 C 687.7,704 686.7,701.8 686,694 C 685.3,686.2 683.5,675.8 682,669 C 680.5,662.2 679.8,659.2 677,653 C 674.2,646.8 670.8,640 665,632 C 659.2,624 652,615.7 642,605 C 632,594.3 614.5,579.2 605,568 C 595.5,556.8 589.3,546.7 585,538 C 580.7,529.3 580.2,524 579,516 C 577.8,508 577.7,497 578,490 C 578.3,483 579.5,479 581,474 C 582.5,469 586,462.5 587,460 C 588,457.5 586.5,457.8 587,459 Z";
// Pivote = centro del bbox real de la llama (524–756 x, 320–806 y). El
// scale del Paso 2 respira alrededor de este mismo punto.
const FLAME_PIVOT_X = 640;
const FLAME_PIVOT_Y = 563;

// ============================================================
// Constantes de calibración del glow (para ajustar sin buscar en el
// resto del componente/CSS). Los keyframes en designV2.css (dsFlameGlow
// Core/Mid/Outer, dsFlameScale) están escritos a mano con estos mismos
// valores — si los cambiás acá, actualizalos ahí también.
// ============================================================
// Cada capa: [radio, opacidad] en estado tenue y encendido.
export const FLAME_GLOW_LAYERS = {
  core: { tenue: [4, 0.5], encendido: [6, 1.0], durationS: 1.7 },
  mid: { tenue: [8, 0.3], encendido: [14, 0.7], durationS: 2.3 },
  outer: { tenue: [16, 0.15], encendido: [26, 0.4], durationS: 3.1 },
};
// Micro-movimiento de escala de la llama (no del escudo).
export const FLAME_SCALE_RANGE = [1, 1.04];
export const FLAME_SCALE_DURATION_S = 2.9; // distinto de 1.7/2.3/3.1 a propósito

export default function SoulTechLogo({ size = LOGO_SIZE, className = "" }) {
  // useId() incluye ":" (ej ":r0:"), válido como id pero mejor evitarlo en
  // un url(#...) por las dudas con algún parser CSS más estricto.
  const maskId = `soultech-flame-mask-${useId().replace(/:/g, "")}`;
  const rootRef = useRef(null);

  // Pausar el pulso/scale cuando la pestaña está oculta (requisito): no se
  // puede pausar una CSS animation con media queries, así que alternamos
  // una clase que fuerza animation-play-state: paused en las capas.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onVisibility = () => {
      el.classList.toggle("soultech-logo--tab-hidden", document.visibilityState !== "visible");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <span ref={rootRef} className={`soultech-logo ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={VIEWBOX} width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={IMG_W} height={IMG_H}>
            <path d={FLAME_D} fill="#fff" fillRule="evenodd" />
          </mask>
        </defs>

        {/* 1. Escudo completo, estático — nunca se le toca filter/transform. */}
        <image href="soultech1.webp" x="0" y="0" width={IMG_W} height={IMG_H} aria-hidden="true" />

        {/* 2/3/4/5. Solo la llama (recortada del mismo PNG vía mask), en un
            grupo que respira en escala; adentro, 3 copias con un glow cada
            una a su propio ritmo + una copia nítida sin blur encima. */}
        <g
          className="soultech-flame-scale-group"
          style={{ transformBox: "view-box", transformOrigin: `${FLAME_PIVOT_X}px ${FLAME_PIVOT_Y}px` }}
          aria-hidden="true"
        >
          <image href="soultech1.webp" x="0" y="0" width={IMG_W} height={IMG_H} mask={`url(#${maskId})`} className="soultech-flame-glow soultech-flame-glow--outer" />
          <image href="soultech1.webp" x="0" y="0" width={IMG_W} height={IMG_H} mask={`url(#${maskId})`} className="soultech-flame-glow soultech-flame-glow--mid" />
          <image href="soultech1.webp" x="0" y="0" width={IMG_W} height={IMG_H} mask={`url(#${maskId})`} className="soultech-flame-glow soultech-flame-glow--core" />
          <image href="soultech1.webp" x="0" y="0" width={IMG_W} height={IMG_H} mask={`url(#${maskId})`} className="soultech-flame-sharp" />
        </g>
      </svg>
    </span>
  );
}
