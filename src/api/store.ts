// import axios from 'axios';
// import { MessageEmbed } from 'discord.js';
// import { Region, StoreResponse, SkinDataResponse } from '../types';
// import authorize from './auth';
// import { embedTemplate } from '../lib/embeds';
// import convertSeconds from '../lib/convertSeconds';

// const getStore = async (
//     username: string,
//     password: string,
//     region: Region,
// ): Promise<MessageEmbed[] | 'multifactor'> => {
//     const authRes = await authorize(username, password);
//     const { type } = authRes;
//     if (type === 'multifactor') return type;
//     const { userId, headers } = authRes;
//     const {
//         data: {
//             SkinsPanelLayout: {
//                 SingleItemOffers: skins,
//                 SingleItemOffersRemainingDurationInSeconds: expiryTimeInSeconds,
//             },
//         },
//     } = await axios.get<StoreResponse>(`https://pd.${region}.a.pvp.net/store/v2/storefront/${userId}`, { headers });
//     const skinEmbeds: MessageEmbed[] = await Promise.all(
//         skins.map(async (skinId) => {
//             const {
//                 data: {
//                     data: { displayName, streamedVideo, displayIcon },
//                 },
//             } = await axios.get<SkinDataResponse>(`https://valorant-api.com/v1/weapons/skinlevels/${skinId}`);
//             if (streamedVideo) {
//                 return embedTemplate(displayName, `[Preview](${streamedVideo})`, displayIcon);
//             }
//             return embedTemplate(displayName, 'Preview Unavailable', displayIcon);
//         }),
//     );
//     const expiryTime: string = convertSeconds(expiryTimeInSeconds);
//     const embed: MessageEmbed = embedTemplate('Offer ends in', expiryTime);
//     skinEmbeds.push(embed);
//     return skinEmbeds;
// };

// export default getStore;
