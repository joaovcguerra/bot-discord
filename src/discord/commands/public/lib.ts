import { createCommand } from "#base";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandType} from "discord.js";

createCommand({
    name: "libs",
    description: "Veja uma lista de libs populares",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const embed = createEmbed({
            color: constants.colors.success,
            description: brBuilder(
                "# Bibliotecas javascript",
                "libs populares:",
            ),
            fields: [
                {
                    name: "⚙️ discord.js",
                    value: "isso eh um **teste**, ok?",
                },
                {
                    inline: true,
                    name: "⚠️ segunda linha",
                    value: "isso eh um **teste** também, ok?",
                },
                {
                    inline: true,
                    name: "⚠️ segunda linha",
                    value: "isso eh um **teste** também, ok?",
                },
            ]
        })
        await interaction.reply({
            flags: ["Ephemeral"],
            embeds: [embed]
        });
    }
});