import { createResponder, ResponderType } from "#base";
import { decodeState, Pecas, renderShiaiEmbed } from "#functions";
import { CacheType, StringSelectMenuInteraction } from "discord.js";

export default createResponder({
    customId: "shiai-remover-select", // Captura o prefixo
    types: [ResponderType.StringSelect],
    async run(interaction) {
        const selectInteraction = interaction as StringSelectMenuInteraction<CacheType>;

        // CORRIGIDO: A lógica de parsing agora funciona
        const parts = selectInteraction.customId.split("-");
        const stateStr = parts[parts.length - 1];
        let state = decodeState(stateStr);

        const slotIndex = parseInt(selectInteraction.values[0]);
        const pecaRemovida = state.pecas[slotIndex];

        if (pecaRemovida) {
            state.pecas[slotIndex] = null;

            const { embeds, components } = renderShiaiEmbed(state, selectInteraction.user.displayName);
            await selectInteraction.message.edit({ embeds, components });

            await selectInteraction.reply({ content: `Peça ${Pecas[pecaRemovida].nome} removida!`, ephemeral: true });
        } else {
            await selectInteraction.reply({ content: "Essa peça não existe mais.", ephemeral: true });
        }
    },
});