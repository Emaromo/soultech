# Soul Tech — Contexto de la App

## Qué es
Landing page comercial de **Soul Tech**, una empresa/estudio de desarrollo de software con sede en Córdoba, Argentina. El sitio presenta los servicios, planes de precios, casos de clientes y un formulario de contacto que deriva a WhatsApp.

## Stack técnico
- **React 19** + **react-scripts 5** (Create React App) — `soul-tech/`
- **Tailwind CSS 3** (vía PostCSS) para estilos utilitarios
- **Framer Motion** para animaciones de entrada, hover y transiciones
- **@tsparticles/react** para el fondo de partículas del header
- **lucide-react** para iconografía
- CSS propio en `src/App.css` y `src/index.css` para efectos "futuristas" (glassmorphism, glow, cubo 3D, partículas, líneas de energía)

## Estructura de carpetas relevante
```
soul-tech/
  src/
    App.jsx                → monta <Landing />
    Landing/
      Landing.jsx           → orquesta todas las secciones
      Header.jsx            → nav fijo + logo animado + menú hamburguesa + partículas
      HeroSection.jsx       → carrusel de 5 slides con typewriter en el título
      StatsSection.jsx      → contadores animados (proyectos, clientes, años, satisfacción)
      ServicesSection.jsx   → grilla de 7 servicios (mobile, web, backend, multiplataforma, UX/UI, consultoría)
      ClientsSection.jsx    → galería de 3 casos de éxito con rotación automática de imágenes + modal
      PricingSection.jsx    → 3 planes + tabla comparativa
      ProcessSection.jsx    → timeline de 4 pasos del proceso de trabajo
      ContactSection.jsx    → formulario que arma un link de WhatsApp + datos de contacto + mapa embebido
      Footer.jsx            → newsletter (mock), redes sociales, partículas ascendentes
      MatrixBackground.jsx  → fondo decorativo (cubo 3D, fórmulas, formas geométricas)
      ui/                   → button, toast, toaster, use-toast (componentes shadcn-like, poco usados)
  public/                  → imágenes de screenshots de clientes, logo (soultech1.png, letras.png)
  public/soul-tech-app.html → [[soul-tech-standalone-export]] export estático de toda la app en un solo archivo
```

## Contenido / negocio
- **Servicios ofrecidos**: apps móviles, apps web, sistemas backend, apps multiplataforma, diseño UX/UI, consultoría tecnológica. También se destacan Cloud Computing, Ciberseguridad e IA en el carrusel del hero.
- **Planes de precios** (`PricingSection.jsx`):
  1. *Aplicación a Medida* (🔧 Exclusivo) — desarrollo a medida + dashboards + landing + dominio 1 año.
  2. *Aplicación Compartida* (🛒 Popular) — sistema ya desarrollado, sin costo inicial, suscripción mensual.
  3. *Landing Page* (🌐 Básico) — web informativa + formulario + WhatsApp + dominio 6 meses.
  Los montos de precio en el JSX están vacíos (`<div className="...">` sin texto) — pendiente de completar por el cliente.
- **Datos de contacto reales**:
  - WhatsApp / teléfono: **+54 9 351 632-5887** (`wa.me/5493516325887`)
  - Email: `techsolution@gmail.com` (nota: distinto del email de la cuenta de usuario)
  - Dirección: Lima 438, Córdoba, Argentina
  - Horario: Lunes a Viernes, 9:00 a 18:00 hs
- El formulario de contacto y el botón de cada plan no envían nada a un backend: abren `wa.me` con un mensaje prellenado.
- El formulario de newsletter en el footer es un mock (solo muestra un mensaje de éxito, no envía nada).

## Identidad visual
Estética "futurista/cyberpunk": fondo degradado oscuro (negro → azul marino → púrpura), paneles de vidrio (`glass-panel`, blur + borde translúcido), textos con `glow-text` (sombra cian/blanca), bordes neón animados, cubo 3D girando de fondo, partículas y fórmulas matemáticas flotantes como decoración, líneas de energía animadas en gradiente cian→azul→púrpura.

## Archivo de referencia generado
`soul-tech/public/soul-tech-app.html` es una copia autocontenida de toda la landing (HTML + CSS + JSX embebido) que corre sin build, usando React/ReactDOM/Babel/Framer Motion vía CDN + Tailwind CDN. Útil para:
- ver/compartir el sitio completo en un solo archivo sin levantar el proyecto React,
- servir de referencia de contenido y diseño para IA o terceros,
- abrir directamente en el navegador (requiere internet por los CDNs; las imágenes se referencian con rutas relativas, por eso vive dentro de `public/`).
No reemplaza al build de producción (`npm run build`); los íconos y el fondo de partículas del header están reimplementados con SVG/CSS locales en vez de `lucide-react`/`tsparticles` para evitar dependencias adicionales de CDN.

## Pendientes conocidos (visibles en el código, no confirmados con el cliente)
- Precios de los 3 planes sin completar en `PricingSection.jsx` y en la tabla comparativa.
- Íconos sociales del footer (`Facebook`, `Instagram`, etc.) apuntan a `href="#"` — sin URLs reales cargadas.
- Hay un directorio hermano `soul-tech/src/Landing/ui/` (button, toast, toaster) que no parece estar en uso activo en la Landing.
