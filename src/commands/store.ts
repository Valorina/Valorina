import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { smallEmbed } from '../lib/embeds';
export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Shows all the available weapon skins in your store'),
    async execute(interaction: CommandInteraction) {
        const embed = smallEmbed('Checking', 'This is a short description');
        await interaction.channel?.send({ embeds: [embed] });
    },
};
