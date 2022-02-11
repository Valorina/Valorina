import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { embedTemplate } from '../lib/embeds';
import { addUser } from '../api/databaseCalls';
import { authorize } from '../api/auth';
import { region, User } from '../types';
import logger from '../log/index';

export default {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Register your user with Valorina')
        .addStringOption((option) => 
            option.setName('username').setDescription('Riot Username').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('password').setDescription('Riot Password').setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('region').setDescription('Select region from: AP, EU, KR, NA').setRequired(true),
        ),

    async execute(interaction: CommandInteraction) {
        const user: User = {
            username: <string>interaction.options.data[0].value,
            password: <string>interaction.options.data[1].value,
            discordId: interaction.user.id,
            region: <region>interaction.options.data[2].value
        }
        try {
            await authorize(user.username, user.password)
            await addUser(user.username, user.password, user.discordId, user.region)
            const embed = embedTemplate('Success', `Added user with Username: ${interaction.options.data[0].value}`, 'https://images-ext-1.discordapp.net/external/UOcDiZZ6DL2XZQWzjzu2mcCNm_fqGCYOLPi-8IJGjvc/https/emoji.gg/assets/emoji/confetti.gif?width=115&height=115');
            await interaction.reply({ embeds: [embed] });
        }
        catch(err){
            logger.error(`{User: ${user.username}, Discord Id: ${user.discordId}, Command: adduser, ${err}}`);
            const embed = embedTemplate('Error Adding User', 'There was a problem adding the User, please try again later or contact the developers on the support server.', 'https://images-ext-2.discordapp.net/external/yK1PgRCTUvZvC2uoRZgdLC3pT6M8G4gX-WGTPIcfsCQ/https/i.imgur.com/au2Yx3O.mp4');
            await interaction.reply({ embeds: [embed] });
        }
    },
};