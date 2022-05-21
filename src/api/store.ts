import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { region } from '../types';
import { authorize } from './auth';
import { embedTemplate } from '../lib/embeds';
import { convertSeconds } from '../lib/convertSeconds';

export const getStore = async (username: string, password: string, region: region): Promise<MessageEmbed[]> => {
    const { headers, userId } = await authorize(username, password);
    const {
        data: {
            SkinsPanelLayout: {
                SingleItemOffers: skins,
                SingleItemOffersRemainingDurationInSeconds: expiryTimeInSeconds,
            },
        },
    } = await axios({
        method: 'get',
        url: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userId}`,
        headers: headers,
    });
    const skinEmbeds: MessageEmbed[] = [];
    for (const skin in skins) {
        const {
            data: { data },
        } = await axios({
            method: 'get',
            url: `https://valorant-api.com/v1/weapons/skinlevels/${skins[skin]}`,
        });
        console.log(data);
        if (data.streamedVideo) {
            skinEmbeds.push(embedTemplate(data.displayName, `[Preview](${data.streamedVideo})`, data.displayIcon));
            continue;
        }
        skinEmbeds.push(embedTemplate(data.displayName, 'Preview Unavailable', data.displayIcon));
    }
    const expiryTime: string = convertSeconds(expiryTimeInSeconds);
    const embed: MessageEmbed = embedTemplate('Offer ends in', expiryTime);
    skinEmbeds.push(embed);
    return skinEmbeds;
};
