import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { addedSuccess, embedTemplate } from '../lib/embeds';
import { addUser } from '../api/databaseCalls';
import authorize from '../api/auth';
import { Region, User, Account } from '../types';
import logger from '../log/index';

export default {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Register your user with Valorina')
        .addStringOption((option) => option.setName('username').setDescription('Riot Username').setRequired(true))
        .addStringOption((option) => option.setName('password').setDescription('Riot Password').setRequired(true))
        .addStringOption((option) =>
            option
                .setName('region')
                .setDescription('Select region from: AP, EU, KR, NA')
                .setRequired(true)
                .setChoices([
                    ['AP', 'ap'],
                    ['EU', 'eu'],
                    ['KR', 'kr'],
                    ['NA', 'na'],
                ]),
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
            return await interaction.reply({ embeds: [addedSuccess(username)], ephemeral: true });
        } catch (e: unknown) {
            const err = e as Error;
            logger.error(`Discord Id: ${interaction.user.id}, Command: adduser, ${err.message}}`);
            const embed = embedTemplate(
                'Error adding account',
                err.message,
                'https://images-ext-2.discordapp.net/external/yK1PgRCTUvZvC2uoRZgdLC3pT6M8G4gX-WGTPIcfsCQ/https/i.imgur.com/au2Yx3O.mp4',
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
