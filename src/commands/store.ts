import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getUserAccounts } from '../api/databaseCalls';
import { embedTemplate, notFoundEmbed } from '../lib/embeds';
import getStore from '../api/store';
import { Account } from '../types';

export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Shows all the available weapon skins in your store')
        .addStringOption((option) =>
            option.setName('username').setDescription('Enter username if multiple accounts are added'),
        )
        .addBooleanOption((option) =>
            option.setName('flex').setDescription('Set to true if you would like to view the store publicly'),
        ),
    async execute(interaction: CommandInteraction) {
        const flex = !!interaction.options.getBoolean('flex');
        await interaction.reply({
            embeds: [
                embedTemplate(
                    'Please wait',
                    'We are working on it',
                    'https://c.tenor.com/FBeNVFjn-EkAAAAC/ben-redblock-loading.gif',
                ),
            ],
            ephemeral: !flex,
        });
        const discordId: string = interaction.user.id;
        const user = await getUserAccounts(discordId);
        if (!user) {
            await interaction.editReply({ embeds: [notFoundEmbed] });
            return;
        }
        const username = interaction.options.getString('username');
        const { accounts } = user;
        if (accounts.length > 1) {
            if (!username) {
                let accStr = '';
                accounts.map((user) => (accStr = `${accStr + user.username}\n`));
                const accounts_embed = embedTemplate('Accounts linked', accStr);
                await interaction.editReply({ embeds: [accounts_embed] });
                return;
            }

            const selectedUser: Account | undefined = accounts.find((item) => item.username === username);

            if (!selectedUser) {
                await interaction.editReply({ embeds: [notFoundEmbed] });
                return;
            }

            const skinEmbeds = await getStore(selectedUser.username, selectedUser.password, selectedUser.region);
            await interaction.editReply({ embeds: skinEmbeds });
            return;
        }
        const skinEmbeds = await getStore(accounts[0].username, accounts[0].password, accounts[0].region);
        await interaction.editReply({ embeds: skinEmbeds });
    },
};
