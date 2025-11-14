import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { renderShiaiEmbed, type ShiaiState } from "#functions";

createCommand({
    name: "shiai",
    description: "Inicia um novo jogo Shiai para você.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nome",
            description: "O nome que aparecerá no seu jogo (pode ser seu nick, do personagem, etc).",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async run(interaction) {
        const nome = interaction.options.getString("nome", true);

        const initialState: ShiaiState = {
            nome: interaction.user.id, // Armazena o ID do usuário para verificação
            apostas: { DOMINIO: 0, AURA: 0, FIRMEZA: 0, INSTINTO: 0, SABEDORIA: 0 },
            pecas: [null, null, null, null, null]
        };

        const replyOptions = renderShiaiEmbed(initialState, nome);

        await interaction.reply(replyOptions);
    },
});