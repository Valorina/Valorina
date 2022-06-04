import { Client, Collection, Interaction } from 'discord.js';
import fs from 'fs';
import { clientId, commandDirPath, eventsDirPath, FileExtension, guildId, selectMenusDirPath, TOKEN } from './config';
import deployCommands from './services/deployCommands';
import { CommandType, EventType, SelectMenuType } from './types';

const main = async () => {
    await deployCommands(TOKEN, clientId, guildId);

    const client = new Client({ intents: [] });

    client.commands = new Collection();
    client.menus = new Collection();
    const commandFiles = fs.readdirSync(commandDirPath).filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        commandFiles.map(async (file) => {
            const command: CommandType = (await import(`${commandDirPath}/${file}`)) as CommandType;
            client.commands.set(command.data.name, command);
        }),
    );

    const selectMenuFiles = fs.readdirSync(selectMenusDirPath).filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        selectMenuFiles.map(async (file) => {
            const selectMenu = (await import(`${selectMenusDirPath}/${file}`)) as SelectMenuType;
            client.menus.set(selectMenu.name, selectMenu);
        }),
    );

    const eventFiles = fs.readdirSync(eventsDirPath).filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        eventFiles.map(async (file) => {
            const event: EventType = (await import(`${eventsDirPath}/${file}`)) as EventType;
            if (event.once) {
                client.once(event.name, (...args: [Client]) => event.execute(...args));
            } else {
                client.on(event.name, (...args: [Interaction]) => event.execute(client, ...args));
            }
        }),
    );

    await client.login(TOKEN);
};

// eslint-disable-next-line no-void
void main();
