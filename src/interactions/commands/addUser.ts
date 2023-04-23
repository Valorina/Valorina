import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Modal } from 'discord.js';
import { accountExists, addedSuccess, embedTemplate } from '../../lib/embeds';
import { addUser } from '../../api/databaseCalls';
import authorize, { userLogin } from '../../api/auth';
import { Region, Account, CommandType } from '../../types';
import logger from '../../log/index';
import { twoFAModal } from '../../lib/modals';

export = {
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
                    ['Asia Pacific', 'ap'],
                    ['Europe', 'eu'],
                    ['Korea', 'kr'],
                    ['North America', 'na'],
                    ['Latin America', 'na'],
                    ['Brazil', 'na'],
                    ['Public Beta Environment', 'na'],
                ]),
        ),

    async execute(interaction: CommandInteraction) {
        try {
            const username = interaction.options.getString('username', true);
            const password = interaction.options.getString('password', true);
            const region = interaction.options.getString('region', true);
            const discordId = interaction.user.id;
            const { type, cookies } = await userLogin(username, password);
            const account: Account = {
                username,
                password,
                region: <Region>region,
                cookie: { cookie: cookies, expiryAt: Date.now() },
            };
            const res = await addUser(discordId, account);
            if (type === 'multifactor') return await interaction.showModal(twoFAModal(username));
            if (type === 'response')
                return await interaction.reply({ embeds: [addedSuccess(username)], ephemeral: true });
            return await interaction.reply({ embeds: [accountExists(username)], ephemeral: true });
        } catch (e: unknown) {
            const err = <Error>e;
            logger.error(`Discord Id: ${interaction.user.id}, Command: adduser, ${err.message}}`);
            const embed = embedTemplate(
                'Error adding account',
                err.message,
                'https://images-ext-2.discordapp.net/external/yK1PgRCTUvZvC2uoRZgdLC3pT6M8G4gX-WGTPIcfsCQ/https/i.imgur.com/au2Yx3O.mp4',
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
} as CommandType;
