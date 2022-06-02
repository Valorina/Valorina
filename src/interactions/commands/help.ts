import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { helpEmbed } from '../../lib/embeds';
import { CommandType } from '../../types';

export = {
    data: new SlashCommandBuilder().setName('help').setDescription('Summary of all available commands'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ embeds: [helpEmbed] });
    },
} as CommandType;
