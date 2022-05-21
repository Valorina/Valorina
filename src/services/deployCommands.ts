import { commandDirPath, FileExtension } from '../config';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import fs from 'fs';

export const deployCommands = async (TOKEN: string, clientId: string, guildId?: string): Promise<void> => {
    const commands: string[] = [];

    const commandFiles: string[] = fs.readdirSync(commandDirPath).filter((file) => file.endsWith(FileExtension));
    for (const file of commandFiles) {
        const command = require(`${commandDirPath}/${file}`);
        commands.push(command.default.data.toJSON());
        console.log(`${command.default.data['name']} ✅`);
    }

    const rest = new REST({ version: '9' }).setToken(TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');
        if (guildId)
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        else
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};
