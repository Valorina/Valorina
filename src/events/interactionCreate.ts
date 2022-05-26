import { Client, Interaction } from 'discord.js';
import { exceptionEmbed } from '../lib/embeds';
import logger from '../log';
import { CommandType } from '../types';

export default {
    name: 'interactionCreate',
    async execute(client: Client, interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        const { default: command } = client.commands.get(interaction.commandName) as CommandType;

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            const err = error as Error;
            logger.error(`Discord Id: ${interaction.user.id}, ${err.message}}`);
            if (interaction.replied) {
                await interaction.editReply({ embeds: [exceptionEmbed()] });
                return;
            }
            await interaction.reply({ embeds: [exceptionEmbed()] });
        }
    },
};
