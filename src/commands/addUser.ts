import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { embedTemplate } from '../lib/embeds';
import { addUser } from '../api/databaseCalls';
import authorize from '../api/auth';
import { Region, User, Account } from '../types';
// import logger from '../log/index';

export default {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Register your user with Valorina')
        .addStringOption((option) => option.setName('username').setDescription('Riot Username').setRequired(true))
        .addStringOption((option) => option.setName('password').setDescription('Riot Password').setRequired(true))
        .addStringOption((option) =>
            option.setName('region').setDescription('Select region from: AP, EU, KR, NA').setRequired(true),
        ),

    async execute(interaction: CommandInteraction) {
        try {
            const username = interaction.options.getString('username', true);
            const password = interaction.options.getString('password', true);
            const region = interaction.options.getString('region', true).toLowerCase();
            if (!Object.values(Region).includes(region as unknown as Region)) {
                throw new Error('Incorrect region entered');
            }
            const account: Account = { username, password, region: <Region>region };
            const user: User = {
                discordId: interaction.user.id,
                accounts: [account],
            };

            await authorize(username, password);
            await addUser(user, account);
            const embed = embedTemplate(
                'Success',
                `Added user with Username: ${username}`,
                'https://images-ext-1.discordapp.net/external/UOcDiZZ6DL2XZQWzjzu2mcCNm_fqGCYOLPi-8IJGjvc/https/emoji.gg/assets/emoji/confetti.gif?width=115&height=115',
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (e: unknown) {
            const err = e as Error;
            // logger.error(`{User: ${user.username}, Discord Id: ${user.discordId}, Command: adduser, ${err}}`);
            const embed = embedTemplate(
                'Error Adding User',
                err.message,
                'https://images-ext-2.discordapp.net/external/yK1PgRCTUvZvC2uoRZgdLC3pT6M8G4gX-WGTPIcfsCQ/https/i.imgur.com/au2Yx3O.mp4',
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
