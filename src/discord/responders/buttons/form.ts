import { createResponder, ResponderType} from "#base";
import { modalFieldsToRecord } from "@magicyan/discord";

createResponder({
    customId: "/buttons/form",
    types: [ResponderType.Modal], cache: "cached",
    async run(interaction) {
        await interaction.deferUpdate();

        const fields = modalFieldsToRecord(interaction);
        console.log(fields);
    },
});