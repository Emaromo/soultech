/**
 * chatFlow.js — Contenido conversacional del asistente de Soul Tech.
 *
 * Separado de la UI a propósito: el chat web y (más adelante) el bot de
 * WhatsApp consumen este MISMO archivo. Por eso cada nodo guarda su texto y
 * sus opciones sin asumir cómo se renderizan — en la web son chips, en
 * WhatsApp serían botones nativos (máx. 3) o un menú numerado.
 *
 * CRITERIO DE CONTENIDO (importante al editar):
 * - Ningún precio, ningún monto, ninguna condición de pago concreta.
 *   Todo lo económico deriva a WhatsApp a propósito.
 * - Respuestas cortas (2-3 líneas): es una burbuja de chat, no una landing.
 * - Cada respuesta cierra con una repregunta o una salida hacia WhatsApp.
 * - Tono: argentino, directo, sin jerga técnica innecesaria.
 *
 * @typedef {'servicios'|'precios'|'tiempos'|'proceso'|'dominio'|'postventa'|'confianza'|'cierre'} FlowCategory
 *
 * @typedef {Object} FlowNode
 * @property {string} id
 * @property {FlowCategory} category
 * @property {string} question  Texto del chip / opción visible
 * @property {string[]} keywords  Para matchear texto libre (normalizado: sin acentos, minúsculas)
 * @property {string} answer
 * @property {string[]} next  Ids sugeridos como chips después de esta respuesta
 * @property {boolean} [cta]  Si true, la UI destaca el botón de WhatsApp
 */

/** @type {FlowNode[]} */
export const flowNodes = [
  // ─────────────────────────────────────────────────────────
  // SERVICIOS
  // ─────────────────────────────────────────────────────────
  {
    id: "servicios-generales",
    category: "servicios",
    question: "¿Qué servicios ofrecen?",
    keywords: ["servicios", "que hacen", "que ofrecen", "a que se dedican", "rubro"],
    answer:
      "Hacemos landing pages, tiendas online, aplicaciones a medida y agentes de IA (de texto y de voz). Todo pensado para negocios que quieren vender más y automatizar tareas. ¿Qué necesitás para tu negocio?",
    next: ["agentes-ia", "agentes-voz", "app-medida", "landing-que-es"],
  },
  {
    id: "landing-que-es",
    category: "servicios",
    question: "¿Qué es una landing page?",
    keywords: ["landing", "pagina web", "sitio web", "web simple", "presencia"],
    answer:
      "Es tu presencia digital profesional: una página pensada para que el visitante te contacte o te compre. Diseño a medida, formulario, integración con WhatsApp y dominio incluido. ¿Querés saber cuánto tarda?",
    next: ["tiempos-landing", "dominio-incluido", "cotizacion"],
  },
  {
    id: "app-medida",
    category: "servicios",
    question: "¿Hacen aplicaciones a medida?",
    keywords: ["aplicacion", "app", "a medida", "sistema", "software", "personalizada", "desarrollo"],
    answer:
      "Sí, es lo que más hacemos: aplicaciones personalizadas para emprendimientos y pymes. Desde sistemas de gestión y turnos hasta paneles de administración completos, todo armado según cómo trabajás vos. ¿Qué necesitás que haga el sistema?",
    next: ["tiempos-app", "proceso", "app-compartida", "cotizacion"],
  },
  {
    id: "app-compartida",
    category: "servicios",
    question: "¿Qué es la Aplicación Compartida?",
    keywords: ["compartida", "sistema probado", "sin costo inicial", "suscripcion"],
    answer:
      "Es un sistema ya desarrollado y en constante evolución al que te sumás con una suscripción mensual. Ideal si querés arrancar rápido sin un desarrollo desde cero. ¿Te cuento cómo se compara con una app a medida?",
    next: ["app-medida", "tiempos-app", "cotizacion"],
  },
  {
    id: "agentes-ia",
    category: "servicios",
    question: "¿Desarrollan agentes de IA?",
    keywords: ["agente", "ia", "inteligencia artificial", "bot", "chatbot", "automatizar", "asistente"],
    answer:
      "Sí, y es de lo más pedido últimamente. Agentes que atienden consultas 24/7, toman pedidos, agendan turnos y se conectan con tus datos y sistemas. Se integran a tu web, a WhatsApp o a tu app. ¿Para qué lo necesitarías?",
    next: ["agentes-voz", "agente-whatsapp", "app-medida", "cotizacion"],
  },
  {
    id: "agentes-voz",
    category: "servicios",
    question: "¿Qué es un agente de voz?",
    keywords: ["voz", "llamada", "telefono", "hablar", "audio", "atiende llamadas", "call"],
    answer:
      "Un asistente que atiende y habla por teléfono como una persona: responde consultas, toma datos y agenda, sin que nadie tenga que estar del otro lado. Se puede integrar a tu aplicación o a tu línea de atención. ¿Querés que veamos si aplica a tu negocio?",
    next: ["agentes-ia", "app-medida", "cotizacion"],
    cta: true,
  },
  {
    id: "agente-whatsapp",
    category: "servicios",
    question: "¿Se puede integrar a WhatsApp?",
    keywords: ["whatsapp", "wpp", "wasap", "integrar whatsapp", "responder whatsapp"],
    answer:
      "Sí. El agente puede atender directamente por WhatsApp: responder preguntas frecuentes, tomar pedidos y derivarte solo las consultas que valen la pena. ¿Querés que lo veamos para tu caso?",
    next: ["agentes-ia", "agentes-voz", "cotizacion"],
    cta: true,
  },
  {
    id: "tienda-online",
    category: "servicios",
    question: "¿Trabajan con tiendas online?",
    keywords: ["tienda", "ecommerce", "vender online", "catalogo", "productos", "carrito"],
    answer:
      "Sí: catálogo, fichas de producto, carrito y checkout. Armado para que vendas, no solo para mostrar. ¿Cuántos productos manejás aproximadamente?",
    next: ["tiempos-app", "dominio-incluido", "cotizacion"],
  },
  {
    id: "rediseno",
    category: "servicios",
    question: "¿Hacen rediseño de webs existentes?",
    keywords: ["rediseno", "renovar", "actualizar web", "ya tengo web", "mejorar mi web"],
    answer:
      "Sí, y muchas veces conviene: se rescata lo que funciona y se rehace lo que no convierte. Si ya tenés una web, pasámela por WhatsApp y te digo qué le mejoraría.",
    next: ["proceso", "tiempos-landing", "cotizacion"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // PRECIOS — sin montos, todo deriva a WhatsApp
  // ─────────────────────────────────────────────────────────
  {
    id: "precio-landing",
    category: "precios",
    question: "¿Cuánto cuesta una landing?",
    keywords: ["cuanto cuesta", "precio", "valor", "sale", "vale", "presupuesto", "cotiza"],
    answer:
      "El precio depende de cuántas secciones e integraciones necesites, así que prefiero pasarte un número real y no uno inventado. Escribime por WhatsApp, me contás qué tenés en mente y te lo paso al toque.",
    next: ["tiempos-landing", "como-se-paga", "cotizacion"],
    cta: true,
  },
  {
    id: "precio-app",
    category: "precios",
    question: "¿Cuánto sale una app a medida?",
    keywords: ["cuanto sale app", "precio app", "costo sistema", "valor aplicacion"],
    answer:
      "Varía bastante según lo que tenga que hacer el sistema. Contame por WhatsApp qué necesitás resolver y te armo un presupuesto concreto, sin vueltas.",
    next: ["tiempos-app", "proceso", "como-se-paga"],
    cta: true,
  },
  {
    id: "como-se-paga",
    category: "precios",
    question: "¿Cómo es la forma de pago?",
    keywords: ["pago", "cuotas", "sena", "adelanto", "financiacion", "transferencia", "abonar"],
    answer:
      "Se trabaja con una seña para arrancar y el resto contra entrega. El detalle exacto depende del proyecto, así que eso lo cerramos por WhatsApp.",
    next: ["proceso", "que-necesitan", "cotizacion"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // TIEMPOS
  // ─────────────────────────────────────────────────────────
  {
    id: "tiempos-landing",
    category: "tiempos",
    question: "¿Cuánto tardan en entregar?",
    keywords: ["cuanto tarda", "tiempo", "demora", "plazo", "cuando esta", "entrega"],
    answer:
      "Una landing page se entrega en aproximadamente una semana, ya con su dominio funcionando. Si es un sistema más complejo son unas dos semanas. ¿Qué tipo de proyecto tenés en mente?",
    next: ["tiempos-app", "proceso", "que-necesitan", "cotizacion"],
  },
  {
    id: "tiempos-app",
    category: "tiempos",
    question: "¿Y una aplicación a medida?",
    keywords: ["tarda app", "tiempo aplicacion", "demora sistema"],
    answer:
      "Alrededor de dos semanas, según qué tan complejo sea el sistema. Si tiene muchas integraciones puede estirarse un poco, pero eso lo vemos antes de arrancar. ¿Querés que lo estimemos para tu caso?",
    next: ["proceso", "que-necesitan", "cotizacion"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // PROCESO
  // ─────────────────────────────────────────────────────────
  {
    id: "proceso",
    category: "proceso",
    question: "¿Cómo es el proceso de trabajo?",
    keywords: ["proceso", "como trabajan", "pasos", "etapas", "metodologia", "como es"],
    answer:
      "Cuatro pasos: charlamos y entendemos tu negocio, diseñamos y planificamos, desarrollamos con entregas parciales para que veas avances, y lanzamos con acompañamiento. Nunca te enterás del resultado recién al final.",
    next: ["que-necesitan", "ver-avances", "tiempos-landing"],
  },
  {
    id: "que-necesitan",
    category: "proceso",
    question: "¿Qué necesitan de mi parte?",
    keywords: ["que necesitan", "que tengo que dar", "que aporto", "requisitos", "para empezar"],
    answer:
      "Con el nombre de tu empresa alcanza para arrancar. El dominio te lo conseguimos nosotros y el resto del contenido lo vamos armando juntos. ¿Arrancamos?",
    next: ["proceso", "tiempos-landing", "cotizacion"],
    cta: true,
  },
  {
    id: "ver-avances",
    category: "proceso",
    question: "¿Puedo ver avances durante el desarrollo?",
    keywords: ["avances", "ver progreso", "seguimiento", "durante", "revisar"],
    answer:
      "Sí, se trabaja con entregas parciales: vas viendo cómo queda y podés pedir ajustes en el camino. Nada de desaparecer dos semanas y aparecer con algo que no era.",
    next: ["proceso", "cambios-despues", "cotizacion"],
  },

  // ─────────────────────────────────────────────────────────
  // DOMINIO / HOSTING — respuestas claras, sin ambigüedad
  // ─────────────────────────────────────────────────────────
  {
    id: "dominio-incluido",
    category: "dominio",
    question: "¿Incluye dominio y hosting?",
    keywords: ["dominio", "hosting", "servidor", "url", "direccion web", "alojamiento"],
    answer:
      "Sí, el dominio va incluido y te lo conseguimos nosotros: figurás como titular y te damos acceso. Funciona como un servicio integral — dominio, alojamiento y mantenimiento van juntos mientras el servicio esté activo. Si querés el detalle fino, lo charlamos por WhatsApp.",
    next: ["dominio-titular", "mantenimiento", "cotizacion"],
    cta: true,
  },
  {
    id: "dominio-titular",
    category: "dominio",
    question: "¿El dominio queda a mi nombre?",
    keywords: ["titular dominio", "dueno dominio", "propiedad", "a mi nombre", "es mio"],
    answer:
      "Figurás como titular y tenés acceso a tu dominio. Es un modelo de servicio continuo: mientras esté activo, el dominio y todo lo demás funcionan sin que te ocupes de nada. Los detalles de la contratación prefiero explicártelos yo directamente — escribime y te los paso claritos.",
    next: ["dominio-incluido", "mantenimiento", "contrato"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // POST-VENTA
  // ─────────────────────────────────────────────────────────
  {
    id: "soporte",
    category: "postventa",
    question: "¿Dan soporte después de entregar?",
    keywords: ["soporte", "despues", "ayuda", "acompanamiento", "post venta", "atencion"],
    answer:
      "Sí, el acompañamiento sigue después del lanzamiento. No te entregamos y desaparecemos. ¿Querés saber qué pasa si aparece algún error?",
    next: ["garantia", "mantenimiento", "cambios-despues"],
  },
  {
    id: "garantia",
    category: "postventa",
    question: "¿Y si algo falla después?",
    keywords: ["falla", "error", "roto", "no funciona", "garantia", "problema", "bug"],
    answer:
      "Tenés garantía: si algo falla, se repara. Es parte del servicio, no un extra. ¿Querés que te cuente cómo funciona el mantenimiento?",
    next: ["mantenimiento", "soporte", "cotizacion"],
  },
  {
    id: "mantenimiento",
    category: "postventa",
    question: "¿Hay que pagar mantenimiento?",
    keywords: ["mantenimiento", "mensual", "abono", "cuota mensual", "mantener"],
    answer:
      "Sí, hay un mantenimiento mínimo que cubre que todo siga funcionando: dominio, alojamiento y actualizaciones de seguridad. El monto depende del proyecto, así que te lo paso por WhatsApp.",
    next: ["garantia", "cambios-despues", "cotizacion"],
    cta: true,
  },
  {
    id: "cambios-despues",
    category: "postventa",
    question: "¿Puedo pedir cambios más adelante?",
    keywords: ["cambios", "modificar", "agregar", "actualizar", "sumar", "mas adelante", "despues"],
    answer:
      "Claro, se pueden sumar secciones o funciones cuando quieras. Las actualizaciones tienen un costo aparte según el tamaño del cambio. Contame qué tenés en mente y te digo.",
    next: ["mantenimiento", "soporte", "cotizacion"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // CONFIANZA
  // ─────────────────────────────────────────────────────────
  {
    id: "quien-trabaja",
    category: "confianza",
    question: "¿Quién hace el trabajo?",
    keywords: ["quien", "equipo", "empresa", "cuantos son", "trabajan", "desarrollador"],
    answer:
      "Trabajás directo conmigo, sin intermediarios ni cadenas de mails. Eso hace que las decisiones sean rápidas y que siempre sepas con quién estás hablando. ¿Querés ver algún proyecto entregado?",
    next: ["proyectos", "contrato", "cotizacion"],
  },
  {
    id: "proyectos",
    category: "confianza",
    question: "¿Puedo ver proyectos anteriores?",
    keywords: ["proyectos", "portfolio", "trabajos", "ejemplos", "clientes", "referencias", "casos"],
    answer:
      "Sí, más arriba en la página está la sección de proyectos entregados: sistemas de gestión, tiendas online y paneles de administración reales. Si querés ver alguno en detalle, escribime.",
    next: ["quien-trabaja", "contrato", "cotizacion"],
  },
  {
    id: "contrato",
    category: "confianza",
    question: "¿Se firma algún contrato?",
    keywords: ["contrato", "papeles", "firmar", "acuerdo", "escrito", "legal", "factura"],
    answer:
      "Sí, queda todo por escrito: qué incluye, plazos y condiciones. Así los dos sabemos a qué atenernos. Te lo paso cuando definamos el proyecto.",
    next: ["quien-trabaja", "como-se-paga", "cotizacion"],
    cta: true,
  },

  // ─────────────────────────────────────────────────────────
  // CIERRE
  // ─────────────────────────────────────────────────────────
  {
    id: "cotizacion",
    category: "cierre",
    question: "Quiero una cotización",
    keywords: ["cotizacion", "presupuesto", "cotizar", "quiero contratar", "empezar", "me interesa"],
    answer:
      "Buenísimo. Contame por WhatsApp qué necesitás y te paso un presupuesto concreto. Respondo en el día.",
    next: [],
    cta: true,
  },
  {
    id: "asesor",
    category: "cierre",
    question: "Hablar con un asesor",
    keywords: ["asesor", "hablar", "persona", "humano", "llamar", "contacto", "consultar"],
    answer: "Dale, hablamos directo por WhatsApp. Contame tu caso y lo vemos.",
    next: [],
    cta: true,
  },
];

/**
 * Chips iniciales: lo primero que ve el usuario al abrir el chat.
 * Elegidos por ser las consultas más frecuentes + un servicio diferencial.
 * @type {string[]}
 */
export const initialChips = ["servicios-generales", "agentes-voz", "tiempos-landing", "cotizacion"];

/**
 * Variantes de fallback. La UI debe ROTAR entre ellas y nunca repetir la
 * misma dos veces seguidas — repetir textual es lo que hace que el bot se
 * sienta roto.
 * @type {string[]}
 */
export const fallbackAnswers = [
  "Esa la puedo responder mejor por WhatsApp, donde te doy el detalle exacto. Mientras tanto, ¿alguna de estas te sirve?",
  "Mmm, esa se me escapa. Preguntame por servicios, tiempos o pedime una cotización, o si preferís lo vemos directo por WhatsApp.",
  "No tengo esa respuesta a mano, pero no quiero mandarte cualquier cosa. ¿Te sirve alguna de estas, o seguimos por WhatsApp?",
  "Para esa consulta te conviene hablarlo conmigo directamente. ¿O querés preguntarme por alguna de estas?",
];

/**
 * Chips que acompañan a cualquier fallback.
 * @type {string[]}
 */
export const fallbackChips = ["servicios-generales", "tiempos-landing", "proceso", "asesor"];

/**
 * Mensaje de bienvenida.
 * @type {string}
 */
export const welcomeMessage =
  "¡Hola! 👋 Soy el asistente de Soul Tech. Preguntame por servicios, tiempos o precios y te oriento. ¿En qué andás?";

/**
 * Normaliza texto libre para el matching por keywords: minúsculas, sin
 * acentos y sin signos. Sin esto, "¿Cuánto cuesta?" no matchea con
 * "cuanto cuesta".
 *
 * @param {string} text
 * @returns {string}
 */
export function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "")
    .trim();
}

/**
 * Busca el nodo que mejor matchea un texto libre. Devuelve null si ninguno
 * supera el umbral — ahí la UI usa un fallback.
 *
 * @param {string} text
 * @returns {FlowNode | null}
 */
export function matchNode(text) {
  const t = normalize(text);
  /** @type {FlowNode | null} */
  let best = null;
  let bestScore = 0;
  for (const node of flowNodes) {
    let score = 0;
    for (const kw of node.keywords) {
      if (t.includes(kw)) score += kw.split(" ").length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = node;
    }
  }
  return bestScore > 0 ? best : null;
}

/**
 * Nodo por id.
 *
 * @param {string} id
 * @returns {FlowNode | null}
 */
export function getNode(id) {
  return flowNodes.find((n) => n.id === id) || null;
}