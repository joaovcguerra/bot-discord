import { createCommand } from "#base";
import { ApplicationCommandType, TextInputStyle, ModalBuilder, ActionRowBuilder, TextInputBuilder} from "discord.js";

createCommand({
  name: "formulário",
  description: "Preencha o formulário",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {

    // 3. Crie o Modal principal
    const modal = new ModalBuilder()
      .setCustomId("/buttons/form")
      .setTitle("Formulário da Equipe");

    // 4. Crie CADA campo de input
    const nameInput = new TextInputBuilder()
      .setCustomId("name") // ID para pegar o valor
      .setLabel("Nome")
      .setPlaceholder("Digite o seu nome")
      .setStyle(TextInputStyle.Short)
      .setMinLength(3)
      .setMaxLength(80);

    const emailInput = new TextInputBuilder()
      .setCustomId("email")
      .setLabel("Email")
      .setStyle(TextInputStyle.Short);

    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Motivo")
      .setStyle(TextInputStyle.Paragraph); // .Paragraph para textos longos

    // 5. Adicione cada input DENTRO de uma Action Row
    // (O Discord exige que CADA input de modal esteja na sua própria Action Row)
    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);

    // 6. Adicione as Action Rows ao modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    // 7. Mostre o modal
    await interaction.showModal(modal);
  },
});