import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getUsers } from '../api/databaseCalls';
import { embedTemplate, notFoundEmbed } from '../lib/embeds';
import { getStore } from '../api/store';

export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Shows all the available weapon skins in your store')
        .addStringOption((option) =>
            option.setName('username').setDescription('Enter username if multiple accounts are added'),
        ),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            embeds: [
                embedTemplate(
                    'Please wait',
                    'We are working on it',
                    'https://c.tenor.com/FBeNVFjn-EkAAAAC/ben-redblock-loading.gif',
                ),
            ],
        });
        const discordId: string = interaction.user.id;
        const users = await getUsers(discordId);
        if (!users) {
            await interaction.editReply({ embeds: [notFoundEmbed] });
            return;
        }
        if (users.length > 1) {
            if (interaction.options.data.length === 0) {
                let acc_str = '';
                users.map((user) => (acc_str = acc_str + user.username + '\n'));
                let accounts_embed = embedTemplate('Accounts linked', acc_str);
                await interaction.editReply({ embeds: [accounts_embed] });
                return;
            }
            const { value } = interaction.options.data[0];

            const selected_user = users.find((item) => item.username === value);

            if (!selected_user) {
                await interaction.editReply({ embeds: [notFoundEmbed] });
                return;
            }

            const skinEmbeds = await getStore(selected_user.username, selected_user.password, selected_user.region);
            await interaction.editReply({ embeds: skinEmbeds });
            return;
        }
        const skinEmbeds = await getStore(users[0].username, users[0].password, users[0].region);
        await interaction.editReply({ embeds: skinEmbeds });
        return;
    },
};
