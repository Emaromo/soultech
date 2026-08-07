import { matchNode, fallbackAnswers } from "../chatFlow";

/**
 * @implements {import('./chatTypes').ChatProvider}
 * Guion estático sobre chatFlow.js: matchea el texto libre con matchNode()
 * y devuelve su `answer`. Si no matchea nada, rota entre fallbackAnswers
 * sin repetir la misma dos veces seguidas (guarda el último índice usado
 * en la instancia). Mismo contrato simple que ApiChatProvider
 * (`sendMessage(text, history): Promise<string>`) — el día que haya un
 * agente real, alcanza con cambiar qué clase se instancia en
 * AssistantSection.jsx, nada más.
 *
 * Los chips/CTA que se muestran después de una respuesta NO salen de acá:
 * AssistantSection llama a matchNode(text) por su cuenta para eso (mismo
 * matcher, sin duplicar lógica) — ver por qué en el comentario de
 * askProvider en AssistantSection.jsx. Así el click en un chip puede
 * resolver directo por id (100% determinístico) sin depender de que su
 * propio texto vuelva a matchear por keywords.
 */
export class ScriptedChatProvider {
  constructor() {
    this._lastFallbackIndex = -1;
  }

  async sendMessage(text, _history, opts = {}) {
    // Latencia simulada para que el estado "typing" tenga sentido — salvo
    // con reduced-motion, donde no debe haber ningún delay artificial.
    if (!opts.reducedMotion) {
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    }

    const node = matchNode(text);
    if (node) return node.answer;
    return this._pickFallback();
  }

  _pickFallback() {
    if (fallbackAnswers.length <= 1) return fallbackAnswers[0];
    let idx;
    do {
      idx = Math.floor(Math.random() * fallbackAnswers.length);
    } while (idx === this._lastFallbackIndex);
    this._lastFallbackIndex = idx;
    return fallbackAnswers[idx];
  }
}
