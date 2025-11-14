import { createResponder, ResponderType } from "#base";
import { ActionRowBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, CacheType, MessageFlags } from "discord.js";
import { decodeState, PecaTipos, Pecas, renderShiaiEmbed, type PecaTipo, type ShiaiState, encodeState } from "#functions";

export default createResponder({
    customId: "shiai-", // CORRIGIDO: Ouve tudo que COMEÇA com "shiai-"
    types: [ResponderType.Button],
    async run(interaction) {
        const btnInteraction = interaction as ButtonInteraction<CacheType>;

        const fullCustomId = btnInteraction.customId;

        const parts = fullCustomId.split("-");
        const action = parts[1]; // "apostar", "rodar", "abrirmenu"

        const stateStr = parts[parts.length - 1];
        let state = decodeState(stateStr);

        if (interaction.user.id !== state.nome) {
            await btnInteraction.reply({
                content: `Ei! Este não é o seu Shiai!`,
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }

        switch (action) {
            case "apostar":
                await handleApostar(btnInteraction, state, parts[2] as PecaTipo);
                break;
            case "rodar":
                await handleRodar(btnInteraction, state);
                break;
            case "abrirmenu":
                const menuType = parts[2];
                await handleAbrirMenu(btnInteraction, state, menuType);
                break;
        }
    },
});

// --- Lógica de Ação ---

async function handleApostar(interaction: ButtonInteraction<CacheType>, state: ShiaiState, peca: PecaTipo) {
    const pecaInfo = Pecas[peca];
    const stateStr = encodeState(state);

    const modal = new ModalBuilder()
        .setCustomId(`shiai-aposta-modal-${peca}-${stateStr}`)
        .setTitle(`Apostar em ${pecaInfo.nome}`);

    const input = new TextInputBuilder()
        .setCustomId("valor-aposta")
        .setLabel(`Valor da Aposta (1-10)`)
        .setPlaceholder("Digite um número de 1 a 10")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(2)
        .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(row);
    await interaction.showModal(modal);
}

async function handleRodar(interaction: ButtonInteraction<CacheType>, state: ShiaiState) {
    const baseWeight = 10;
    const weightedList: PecaTipo[] = [];

    PecaTipos.forEach(p => {
        const peso = baseWeight + (state.apostas[p] * 10);
        for (let i = 0; i < peso; i++) {
            weightedList.push(p);
        }
    });

    const Sorteada = weightedList[Math.floor(Math.random() * weightedList.length)];
    const pecaInfo = Pecas[Sorteada];

    const primeiroSlotVazio = state.pecas.indexOf(null);
    let feedbackTexto = `Você rodou e ganhou: ${pecaInfo.emoji} **${pecaInfo.nome}**!`;

    if (primeiroSlotVazio !== -1) {
        state.pecas[primeiroSlotVazio] = Sorteada;
    } else {
        feedbackTexto += "\n(Seu inventário de peças está cheio!)";
    }

    PecaTipos.forEach(p => { state.apostas[p] = 0; });

    const replyOptions = renderShiaiEmbed(state, interaction.user.displayName);

    await interaction.update({
        content: feedbackTexto,
        ...replyOptions
    } as any);
}

async function handleAbrirMenu(interaction: ButtonInteraction<CacheType>, state: ShiaiState, menuType: string) {
    const stateStr = encodeState(state);

    if (menuType === "remover") {
        const pecasArmazenadas = state.pecas
            .map((peca, index) => ({ peca, index }))
            .filter(p => p.peca !== null);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`shiai-remover-select-${stateStr}`)
            .setPlaceholder("Selecione a peça para remover")
            .setOptions(
                pecasArmazenadas.map(p => {
                    const pecaInfo = Pecas[p.peca!];
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(`${pecaInfo.nome} (Slot ${p.index + 1})`)
                        .setValue(p.index.toString())
                        .setEmoji(pecaInfo.emoji);
                })
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
        await interaction.reply({
            components: [row],
            flags: [MessageFlags.Ephemeral]
        });

    } else if (menuType === "adicionar") {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`shiai-adicionar-select-${stateStr}`)
            .setPlaceholder("Selecione a peça para adicionar")
            .setOptions(
                PecaTipos.map(p => {
                    const pecaInfo = Pecas[p];
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(pecaInfo.nome)
                        .setValue(p)
                        .setEmoji(pecaInfo.emoji);
                })
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
        await interaction.reply({
            components: [row],
            flags: [MessageFlags.Ephemeral]
        });
    }
}