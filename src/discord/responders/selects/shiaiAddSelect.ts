import { createResponder, ResponderType } from "#base";
import { decodeState, Pecas, renderShiaiEmbed, type PecaTipo } from "#functions";
import { CacheType, StringSelectMenuInteraction } from "discord.js";

export default createResponder({
    customId: "shiai-adicionar-select", // Captura o prefixo
    types: [ResponderType.StringSelect],
    async run(interaction) {
        const selectInteraction = interaction as StringSelectMenuInteraction<CacheType>;

        // CORRIGIDO: A lógica de parsing agora funciona
        const parts = selectInteraction.customId.split("-");
        const stateStr = parts[parts.length - 1];
        let state = decodeState(stateStr);

        const pecaAdicionada = selectInteraction.values[0] as PecaTipo;
        const primeiroSlotVazio = state.pecas.indexOf(null);

        if (primeiroSlotVazio !== -1) {
            state.pecas[primeiroSlotVazio] = pecaAdicionada;

            const { embeds, components } = renderShiaiEmbed(state, selectInteraction.user.displayName);
            await selectInteraction.message.edit({ embeds, components });

            await selectInteraction.reply({ content: `Peça ${Pecas[pecaAdicionada].nome} adicionada!`, ephemeral: true });

        } else {
            await selectInteraction.reply({ content: "Seu inventário está cheio!", ephemeral: true });
        }
    },
});