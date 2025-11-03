
import { bootstrap } from "#base";
import { GatewayIntentBits } from "discord.js";

await bootstrap({
    meta: import.meta,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});