import { MessageEmbed } from 'discord.js';

export const smallEmbed = (title: string, description: string): MessageEmbed => {
    const embed: MessageEmbed = new MessageEmbed().setColor('RED').setTitle(title).setDescription(description);
    return embed;
};

export const thumbnailEmbed = (title: string, description: string, url: string): MessageEmbed => {
    const embed: MessageEmbed = new MessageEmbed()
        .setTitle(title)
        .setColor('RED')
        .setDescription(description)
        .setThumbnail(url);
    return embed;
};
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
