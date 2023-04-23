import { Client, Collection, Interaction } from 'discord.js';
import fs from 'fs';
import { clientId, eventsDirPath, FileExtension, guildId, interactionsDirPath, TOKEN } from './config';
import deployCommands from './services/deployCommands';
import { CommandType, EventType, SelectMenuType, ModalSubmitType } from './types';

const main = async () => {
    await deployCommands(TOKEN, clientId, guildId);

    const client = new Client({ intents: [] });

    client.commands = new Collection();
    client.menus = new Collection();
    client.modals = new Collection();
    const commandFiles = fs
        .readdirSync(`${interactionsDirPath}/commands`)
        .filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        commandFiles.map(async (file) => {
            const command: CommandType = (await import(`${interactionsDirPath}/commands/${file}`)) as CommandType;
            client.commands.set(command.data.name, command);
        }),
    );

    const selectMenuFiles = fs
        .readdirSync(`${interactionsDirPath}/selectMenus`)
        .filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        selectMenuFiles.map(async (file) => {
            const selectMenu = (await import(`${interactionsDirPath}/selectMenus/${file}`)) as SelectMenuType;
            client.menus.set(selectMenu.name, selectMenu);
        }),
    );

    const submitModalFiles = fs
        .readdirSync(`${interactionsDirPath}/modals`)
        .filter((file) => file.endsWith(FileExtension));

    await Promise.all(
        submitModalFiles.map(async (file) => {
            const submitModal = (await import(`${interactionsDirPath}/modals/${file}`)) as ModalSubmitType;
            client.modals.set(submitModal.name, submitModal);
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
