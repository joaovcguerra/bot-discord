import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionReplyOptions } from "discord.js";
import { brBuilder } from "@magicyan/discord";

export const Pecas = {
    DOMINIO: { nome: "Domínio", cor: ButtonStyle.Secondary, emoji: "🛡️" },
    AURA: { nome: "Aura", cor: ButtonStyle.Primary, emoji: "✨" },
    FIRMEZA: { nome: "Firmeza", cor: ButtonStyle.Primary, emoji: "🪨" }, // Emoji corrigido
    INSTINTO: { nome: "Instinto", cor: ButtonStyle.Danger, emoji: "🔥" },
    SABEDORIA: { nome: "Sabedoria", cor: ButtonStyle.Success, emoji: "💡" }
};
export type PecaTipo = keyof typeof Pecas;
export const PecaTipos = Object.keys(Pecas) as PecaTipo[];

export interface ShiaiState {
    nome: string; // ID DO USUÁRIO
    apostas: Record<PecaTipo, number>;
    pecas: (PecaTipo | null)[];
}

// CORRIGIDO: Usa "|" e "_" como separadores
export function encodeState(state: ShiaiState): string {
    const a = PecaTipos.map(p => state.apostas[p]).join("|"); // Usa "|"
    const p = state.pecas.map(p => p ? p.slice(0, 1) : "N").join("|"); // Usa "|"
    return `${a}_${p}_${state.nome}`; // Usa "_"
}

// CORRIGIDO: Lê "|" e "_"
export function decodeState(encoded: string): ShiaiState {
    const [apostasStr, pecasStr, userId] = encoded.split("_");
    const nome = userId;
    const apostasVal = apostasStr.split("|").map(Number); // Lê "|"
    const pecasVal = pecasStr.split("|").map(p => { // Lê "|"
        if (p === "N") return null;
        return PecaTipos.find(pt => pt.startsWith(p)) || null;
    });

    const apostas = {} as Record<PecaTipo, number>;
    PecaTipos.forEach((p, i) => { apostas[p] = apostasVal[i] || 0; });

    return { nome, apostas, pecas: pecasVal };
}

export function renderShiaiEmbed(state: ShiaiState, displayName: string): InteractionReplyOptions {
    const embed = new EmbedBuilder()
        .setTitle(`Shiai de ${displayName}`)
        .setColor("#C4A7E7");

    const pecasArmazenadas = state.pecas.filter(p => p !== null);
    let pecasTexto = "Nenhuma peça armazenada.";
    if (pecasArmazenadas.length > 0) {
        pecasTexto = pecasArmazenadas.map((p, i) => {
            const pecaInfo = Pecas[p!];
            return `${i + 1}. ${pecaInfo.emoji} ${pecaInfo.nome}`;
        }).join("\n");
    }
    embed.addFields({ name: "Peças Armazenadas (Máx: 5)", value: pecasTexto });

    const baseWeight = 10;
    const pesos = PecaTipos.map(p => baseWeight + (state.apostas[p] * 10));
    const pesoTotal = pesos.reduce((acc, w) => acc + w, 0);

    const porcentagensTexto = PecaTipos.map((p, i) => {
        const porcentagem = ((pesos[i] / pesoTotal) * 100).toFixed(1);
        const apostaTxt = state.apostas[p] > 0 ? ` (+${state.apostas[p] * 10}%)` : "";
        return `${Pecas[p].emoji} ${Pecas[p].nome}: **${porcentagem}%**${apostaTxt}`;
    }).join("\n");

    embed.addFields({
        name: "Apostas e Chances", value: brBuilder(
            "-----------",
            "Aposte nas peças para aumentar suas chances:",
            porcentagensTexto
        )
    });

    const stateStr = encodeState(state);

    // CORRIGIDO: Os IDs dos botões agora usam "-" como separador principal
    const rowApostas = new ActionRowBuilder<ButtonBuilder>();
    PecaTipos.forEach(p => {
        const pecaInfo = Pecas[p];
        rowApostas.addComponents(
            new ButtonBuilder()
                .setCustomId(`shiai-apostar-${p}-${stateStr}`) // ID agora é seguro
                .setLabel(pecaInfo.nome)
                .setEmoji(pecaInfo.emoji)
                .setStyle(pecaInfo.cor)
        );
    });

    const rowRodar = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`shiai-rodar-${stateStr}`) // ID agora é seguro
            .setLabel("Rodar")
            .setEmoji("🎲")
            .setStyle(ButtonStyle.Primary)
    );

    const rowGerenciar = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`shiai-abrirmenu-remover-${stateStr}`) // ID agora é seguro
            .setLabel("Remover Peça")
            .setEmoji("🗑️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pecasArmazenadas.length === 0),
        new ButtonBuilder()
            .setCustomId(`shiai-abrirmenu-adicionar-${stateStr}`) // ID agora é seguro
            .setLabel("Adicionar Peça")
            .setEmoji("➕")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pecasArmazenadas.length >= 5)
    );

    return { embeds: [embed], components: [rowApostas, rowRodar, rowGerenciar] };
}