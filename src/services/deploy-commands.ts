import '../lib/env';
import { envHandler } from '../lib/errors';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


const clientId: string = envHandler(process.env.DEV_CLIENT_ID);
const guildId: string = envHandler(process.env.GUILD_ID);
const TOKEN: string = envHandler(process.env.DEV_TOKEN);

const commands: string[] = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


