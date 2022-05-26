import { Client, Collection, Intents, Interaction } from 'discord.js';
import fs from 'fs';
import { clientId, commandDirPath, eventsDirPath, FileExtension, guildId, TOKEN } from './config';
import deployCommands from './services/deployCommands';
import { CommandType, EventType } from './types';

const main = async () => {
    await deployCommands(TOKEN, clientId, guildId);

    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    client.commands = new Collection();
    const commandFiles = fs.readdirSync(commandDirPath).filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        commandFiles.map(async (file) => {
            const command: CommandType = (await import(`${commandDirPath}/${file}`)) as CommandType;
            client.commands.set(command.default.data.name, command);
        }),
    );

    const eventFiles = fs.readdirSync(eventsDirPath).filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        eventFiles.map(async (file) => {
            const { default: event }: EventType = (await import(`${eventsDirPath}/${file}`)) as EventType;
            if (event.once) {
                client.once(event.name, (...args: [Client]) => event.execute(...args));
            } else {
                client.on(event.name, (...args: [Client, Interaction]) => event.execute(client, ...args));
            }
        }),
    );

    await client.login(TOKEN);
};

// eslint-disable-next-line no-void
void main();
