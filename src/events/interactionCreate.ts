import { Client, Interaction } from 'discord.js';
import { exceptionEmbed } from '../lib/embeds';
import logger from '../log';
import { CommandType, EventType, ModalSubmitType, SelectMenuType } from '../types';

export = {
    name: 'interactionCreate',
    async execute(client: Client, interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName) as CommandType;
            try {
                await command.execute(interaction);
            } catch (error) {
                const err = error as Error;
                logger.error(`Module:Command Interaction, Discord Id: ${interaction.user.id}, ${err.message}}`);
                if (interaction.replied) {
                    await interaction.editReply({ embeds: [exceptionEmbed()] });
                    return;
                }
                await interaction.reply({ embeds: [exceptionEmbed()] });
            }
        }
        if (interaction.isSelectMenu()) {
            const args = interaction.customId.split(';');
            const selectMenu = client.menus.get(args[0]) as SelectMenuType;
            try {
                await selectMenu.execute(interaction, args);
            } catch (error) {
                const err = error as Error;
                logger.error(`Module:Select Menu Interaction, Discord Id: ${interaction.user.id}, ${err.message}}`);
            }
        }
        if (interaction.isModalSubmit()) {
            const args = interaction.customId.split(';');
            const submitModal = <ModalSubmitType>client.modals.get(args[0]);
            try {
                await submitModal.execute(interaction, args);
            } catch (error) {
                const err = <Error>error;
                logger.error(`Module:Modal Submit Interaction, Discord Id: ${interaction.user.id}, ${err.message}}`);
            }
        }
    },
} as EventType;
