import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { embedTemplate } from '../lib/embeds';
export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Shows all the available weapon skins in your store'),
    async execute(interaction: CommandInteraction) {
        const embed = embedTemplate('Checking', 'This is a short description after change');
        await interaction.reply({ embeds: [embed] });
    },
};
