import { createCommand } from "#base";
import { createModalFields } from "@magicyan/discord";
import { ApplicationCommandType } from "discord.js";

createCommand({
  name: "formulário",
  description: "Preencha o formulário.",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    await interaction.showModal({
      customId: "/staff/form",
      title: "Formulário da Equipe",
      components: createModalFields({
        name: {
          label: "Nome",
          placeholder: "Digite o seu nome",
          minLenght: 3,
          maxLenght: 80,
        },
        email: {
          label: "Email",
        },
        reason: {
          label: "Motivo",
        },
      }),
    });
  },
});
