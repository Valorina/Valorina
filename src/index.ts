import { Client, Intents, Collection } from 'discord.js';
import './lib/env';
import fs from 'fs';
import { deployCommands } from './services/deployCommands';
import { envHandler } from './lib/errors';

// TOKEN
// const TOKEN: string = envHandler(process.env.TOKEN);

// DEV TOKEN
const TOKEN: string = envHandler(process.env.DEV_TOKEN);
const clientId: string = envHandler(process.env.DEV_CLIENT_ID);
const guildId: string = envHandler(process.env.GUILD_ID);

deployCommands(TOKEN, clientId, guildId);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.default.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const { default: event } = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(TOKEN);
