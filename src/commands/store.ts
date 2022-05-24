import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { embedTemplate, notFoundEmbed } from '../lib/embeds';
import { getUserAccounts } from '../api/databaseCalls';
import { Account } from '../types';
import getStore from '../api/store';

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
        const { accounts } = user;
        if (accounts.length > 1) {
            const username = interaction.options.getString('username');
            const selectedAccount: Account | undefined = accounts.find((account) => account.username === username);
            if (!selectedAccount) {
                const accStr = accounts.reduce<string>((total, curr) => `${total + curr.username}\n`, ' ');
                const accountsEmbed = embedTemplate('Linked Accounts', accStr);
                await interaction.editReply({ embeds: [accountsEmbed] });
                return;
            }
            const skinEmbeds = await getStore(
                selectedAccount.username,
                selectedAccount.password,
                selectedAccount.region,
            );
            await interaction.editReply({ embeds: skinEmbeds });
            return;
        }
        const skinEmbeds = await getStore(accounts[0].username, accounts[0].password, accounts[0].region);
        await interaction.editReply({ embeds: skinEmbeds });
    },
};
