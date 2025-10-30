import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { rollDice } from "#functions";

createCommand({
    name: "roll",
    description: "Rola um ou mais dados (ex: 2d20+5)",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "notacao",
            description: "A notação do dado (ex: 4d6, 1d20+3, 2dF)",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async run(interaction) {
        const notation = interaction.options.getString("notacao", true);
        const result = rollDice(notation);

        if (result.success) {
            await interaction.reply(`🎲 **${interaction.user.username} rolou:**\n\`\`\`\n${result.output}\n\`\`\``);
        } else {
            await interaction.reply({ content: result.output, ephemeral: true });
        }
    },
});