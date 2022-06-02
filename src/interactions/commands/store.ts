import { CommandInteraction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { notFoundEmbed } from '../../lib/embeds';
import { getUserAccounts } from '../../api/databaseCalls';
import getStore from '../../api/store';
import { CommandType } from '../../types';

export = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Shows all the available weapon skins in your store')
        .addBooleanOption((option) =>
            option.setName('flex').setDescription('Set to true if you would like to view the store publicly'),
        ),
    async execute(interaction: CommandInteraction) {
        const flex = !!interaction.options.getBoolean('flex');
        await interaction.deferReply({ ephemeral: !flex });
        const discordId: string = interaction.user.id;
        const user = await getUserAccounts(discordId);
        if (!user) {
            await interaction.editReply({ embeds: [notFoundEmbed] });
            return;
        }
        const { accounts } = user;
        if (accounts.length > 1) {
            const options: MessageSelectOptionData[] = accounts.map((account) => ({
                label: account.username,
                value: account.username,
            }));

            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`userSelector;${flex ? String(flex) : ''}`)
                    .addOptions(options)
                    .setPlaceholder('Choose an Account'),
            );
            await interaction.editReply({ embeds: [], components: [row] });
            return;
        }
        const skinEmbeds = await getStore(accounts[0].username, accounts[0].password, accounts[0].region);
        await interaction.editReply({ embeds: skinEmbeds });
    },
} as CommandType;
