import { createEvent } from "#base";
import { rollDice } from "#functions";
import { Events } from "discord.js";

// O constatic usa createEvent para lidar com eventos do discord.js
createEvent({
    name: "PrefixDiceRoll",
    event: Events.MessageCreate, // Este é o evento "messageCreate"

    async run(message) {

        // Ignora bots e mensagens de DM
        if (message.author.bot || !message.guild) return;

        const prefix = "+s";

        // Verifica se a mensagem começa com o prefixo
        if (message.content.startsWith(prefix)) {

            // Pega a notação (ex: "+s 2d20+1" -> "2d20+1")
            const notation = message.content.slice(prefix.length).trim();

            // Se não houver notação (só "+s"), não faz nada
            if (!notation) return;

            // Rola os dados
            const result = rollDice(notation);

            // Envia a resposta no canal
            if (result.success) {
                await message.reply(`🎲 **${message.author.username} rolou:**\n\`\`\`\n${result.output}\n\`\`\``);
            }
        }
    },
});