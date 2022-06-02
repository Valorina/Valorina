import { SelectMenuInteraction } from 'discord.js';
import { getUserAccounts } from '../../api/databaseCalls';
import getStore from '../../api/store';
import { Account, User } from '../../types';

export default {
    name: 'userSelector',
    async execute(interaction: SelectMenuInteraction, args: [string, string]) {
        const flex = !!args[1];
        const discordId: string = interaction.user.id;
        const user = await getUserAccounts(discordId);
        const { accounts } = user as User;
        const username = interaction.values[0];
        const selectedAccount: Account = accounts.find((account) => account.username === username) as Account;
        const skinEmbeds = await getStore(selectedAccount.username, selectedAccount.password, selectedAccount.region);
        await interaction.reply({ embeds: skinEmbeds, components: [], ephemeral: !flex });
    },
};
