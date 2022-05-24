import { MessageEmbed } from 'discord.js';

export const embedTemplate = (title: string, description: string, url?: string): MessageEmbed => {
    if (!url) {
        const embed: MessageEmbed = new MessageEmbed()
            .setTitle(title)
            .setColor('RED')
            .setDescription(description)
            .setThumbnail('https://i.imgur.com/jnqBJFs.png');
        return embed;
    }
    const embed: MessageEmbed = new MessageEmbed()
        .setTitle(title)
        .setColor('RED')
        .setDescription(description)
        .setThumbnail(url);
    return embed;
};
export const notFoundEmbed = embedTemplate('No Accounts found', 'Use /adduser to add an account');

export const exceptionEmbed = (): MessageEmbed => {
    const embed: MessageEmbed = new MessageEmbed()
        .setTitle('Something went wrong :(')
        .setDescription('Please try!')
        .setColor('RED')
        .setThumbnail(
            'https://images-ext-2.discordapp.net/external/yK1PgRCTUvZvC2uoRZgdLC3pT6M8G4gX-WGTPIcfsCQ/https/i.imgur.com/au2Yx3O.mp4',
        );
    return embed;
};

export const helpEmbed: MessageEmbed = new MessageEmbed()
    .setTitle('Help')
    .setColor('RED')
    .setThumbnail('https://i.imgur.com/jnqBJFs.png')
    .setDescription('Summary of all available commands')
    .addFields([
        { name: '/adduser', value: 'Adds an account', inline: false },
        {
            name: '/store',
            value: 'Shows all the available weapon skins in your store',
            inline: false,
        },
        // { name: '/bal', value: 'Shows the balance of your account', inline: false },
        // {
        //     name: '/setreminder',
        //     value: 'Sets reminder of your favourite skin and notifies you if it is available in your store',
        //     inline: false,
        // },
        // {
        //     name: '/showreminder',
        //     value: 'Shows all the reminder that is set by user',
        //     inline: false,
        // },
        // { name: '/delreminder', value: 'Deletes the reminder that is set', inline: false },
        // { name: '/skins', value: 'Links to weapon skins available in-game', inline: false },
        // { name: '/updatepass', value: 'Updates the password', inline: false },
        // { name: '/deluser', value: 'Deletes the user from database', inline: false },
        {
            name: '\u200B',
            value: 'Contribute to Valorina [here](https://github.com/Valorina/Valorina)',
            inline: false,
        },
        {
            name: '\u200B',
            value: 'Join our support server [here](https://discord.gg/zHTGSaAjp8)',
            inline: false,
        },
    ]);
