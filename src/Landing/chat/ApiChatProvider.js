import { CHAT_CONFIG } from "./chatTypes";

/**
 * @implements {import('./chatTypes').ChatProvider}
 * NO está conectado todavía — es el reemplazo directo de ScriptedChatProvider
 * el día que haya un agente real: mismo `sendMessage(text, history)`, mismo
 * `Promise<string>`, así que en AssistantSection.jsx alcanza con cambiar
 *   const provider = new ScriptedChatProvider();
 * por
 *   const provider = new ApiChatProvider();
 * y setear CHAT_CONFIG.apiEndpoint (chatTypes.js). Nada más en la UI cambia.
 */
export class ApiChatProvider {
  async sendMessage(text, history) {
    if (!CHAT_CONFIG.apiEndpoint) {
      throw new Error("CHAT_CONFIG.apiEndpoint no está configurado.");
    }
    const res = await fetch(CHAT_CONFIG.apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: history.map(({ role, content }) => ({ role, content })),
      }),
    });
    if (!res.ok) throw new Error(`Chat API respondió ${res.status}`);
    const data = await res.json();
    return data.reply;
  }
}
