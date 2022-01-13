import { Client, CommandInteraction } from 'discord.js';
import { exceptionEmbed } from '../lib/embeds';
export default {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction, client: Client) {
        if (!interaction.isCommand()) return;

        const { default: command } = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            await interaction.channel?.send({ embeds: [exceptionEmbed()] });
        }
    },
};
