/**
 * Contrato compartido entre la capa de UI (AssistantSection) y la capa de
 * datos (cualquier ChatProvider). La UI SOLO conoce esta forma — nunca sabe
 * si las respuestas vienen de un guion estático o de un agente real, así que
 * cambiar de proveedor el día de mañana no toca ni una línea de AssistantSection.
 *
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'assistant'} role
 * @property {string} content
 * @property {number} timestamp
 * @property {'sending'|'sent'|'error'} [status]
 */

/**
 * @typedef {Object} ChatProvider
 * @property {(text: string, history: ChatMessage[], opts?: { reducedMotion?: boolean }) => Promise<string>} sendMessage
 *   Devuelve el texto de la respuesta, nada más — ni nodeId ni acciones.
 *   Los chips/CTA que siguen a una respuesta los resuelve la UI llamando a
 *   matchNode()/getNode() de chatFlow.js por su cuenta (no dependen del
 *   provider), así ApiChatProvider (agente real) puede implementar este
 *   mismo contrato sin saber nada de chips.
 *   `opts.reducedMotion` es opcional — le permite al provider saltear
 *   latencia simulada (no aplica a un backend real, donde la latencia ya es
 *   real y no hay nada que "saltear").
 */

// Config centralizada para cuando se conecte el agente real: solo hay que
// setear `apiEndpoint` e instanciar ApiChatProvider en vez de
// ScriptedChatProvider — la UI no cambia.
export const CHAT_CONFIG = {
  apiEndpoint: null, // ej: "https://tu-backend.com/api/chat"
};

let idCounter = 0;
export const nextMessageId = () => `msg-${Date.now()}-${idCounter++}`;

export {};
