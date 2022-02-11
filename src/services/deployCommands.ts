import '../lib/env';
import { envHandler } from '../lib/errors';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export const deployCommands = async (TOKEN: string, clientId: string, guildId?: string): Promise<void> => {
    const commands: string[] = [];
    const commandFiles: string[] = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.default.data.toJSON());
        console.log(`${command.default.data['name']} ✅`);
    }

    const rest = new REST({ version: '9' }).setToken(TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId!), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};
