import { Client, Interaction } from 'discord.js';
import { exceptionEmbed } from '../lib/embeds';
export default {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isCommand()) return;

        const { default: command } = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            if (interaction.replied) {
                await interaction.editReply({ embeds: [exceptionEmbed()] });
                return;
            }
            await interaction.reply({ embeds: [exceptionEmbed()] });
        }
    },
};
