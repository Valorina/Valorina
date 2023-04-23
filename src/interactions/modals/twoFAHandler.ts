import { ModalSubmitInteraction } from 'discord.js';
import { send2fa } from '../../api/auth';
import { getCookie } from '../../api/databaseCalls';

export = {
    name: 'twoFAHandler',
    async execute(interaction: ModalSubmitInteraction, args: [string, string]) {
        const cookies = await getCookie(interaction.user.id, args[1]);
        const code = interaction.fields.getTextInputValue('code');
        const res = await send2fa(code, cookies.cookie);
    },
};
