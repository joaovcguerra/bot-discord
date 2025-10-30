import { DiceRoller } from '@dice-roller/rpg-dice-roller';

export function rollDice(notation: string) {
    try {
        const roller = new DiceRoller();
        roller.roll(notation);

        const total = roller.total;
        const output = roller.output;

        return { success: true, total, output };

    } catch (error) {
        return { success: false, output: `Notação de dado inválida: "${notation}"` };
    }
}