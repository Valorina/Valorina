import { MessageEmbed } from 'discord.js';

export const embedTemplate = (title: string, description: string, url?: string): MessageEmbed => {
    if (!url) {
        const embed: MessageEmbed = new MessageEmbed().setTitle(title).setColor('RED').setDescription(description);
        return embed;
    }
    const embed: MessageEmbed = new MessageEmbed()
        .setTitle(title)
        .setColor('RED')
        .setDescription(description)
        .setThumbnail(url);
    return embed;
};
export const notFoundEmbed = embedTemplate('User not found', 'User does not exist in our DB Use /adduser to add user');

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
