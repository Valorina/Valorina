import { clientId, commandDirPath, eventsDirPath, FileExtension, guildId, TOKEN } from './config';
import { deployCommands } from './services/deployCommands';
import { Client, Collection, Intents } from 'discord.js';
import fs from 'fs';

deployCommands(TOKEN, clientId, guildId);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(commandDirPath).filter((file) => file.endsWith(FileExtension));
for (const file of commandFiles) {
    const command = require(`${commandDirPath}/${file}`);
    client.commands.set(command.default.data.name, command);
}

const eventFiles = fs.readdirSync(eventsDirPath).filter((file) => file.endsWith(FileExtension));

for (const file of eventFiles) {
    const { default: event } = require(`${eventsDirPath}/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(TOKEN);
