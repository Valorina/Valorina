import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { commandDirPath, FileExtension } from '../config';
import { CommandType } from '../types';
import logger from '../log';

export default async (TOKEN: string, clientId: string, guildId?: string): Promise<void> => {
    const commandFiles: string[] = fs.readdirSync(commandDirPath).filter((file) => file.endsWith(FileExtension));

    const commands = await Promise.all(
        commandFiles.map(async (file) => {
            const command: CommandType = (await import(`${commandDirPath}/${file}`)) as CommandType;
            const { data } = command;
            logger.info(`${data.name} ✅`);
            return data;
        }),
    );
    const rest = new REST({ version: '9' }).setToken(TOKEN);

    try {
        logger.info('Started refreshing application (/) commands.');
        if (guildId) {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        } else {
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
        }
        logger.info('Successfully reloaded application (/) commands.');
    } catch (error) {
        const err = error as Error;
        logger.error(`Module:deployCommands, Error: ${err.message}`);
    }
};
