import { createResponder, ResponderType } from "#base";
import { decodeState, renderShiaiEmbed, Pecas, type PecaTipo } from "#functions";
import { CacheType, ModalSubmitInteraction } from "discord.js";

export default createResponder({
    customId: "shiai-aposta-modal", // Captura o prefixo "shiai-aposta-modal"
    types: [ResponderType.Modal],
    async run(interaction) {
        const modalInteraction = interaction as ModalSubmitInteraction<CacheType>;

        const parts = modalInteraction.customId.split("-");

        // CORRIGIDO: A lógica de parsing agora funciona
        const peca = parts[3] as PecaTipo;
        const stateStr = parts[parts.length - 1]; // O estado é o último
        let state = decodeState(stateStr);

        let valor = parseInt(modalInteraction.fields.getTextInputValue("valor-aposta"));

        if (isNaN(valor) || valor < 1) valor = 1;
        if (valor > 10) valor = 10;

        state.apostas[peca] = valor;

        const replyOptions = renderShiaiEmbed(state, modalInteraction.user.displayName);

        await (modalInteraction as any).update({
            content: `Você apostou **${valor}** em **${Pecas[peca].nome}**!`,
            ...replyOptions
        });
    },
});