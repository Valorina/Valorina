import path from 'path';
import { envHandler } from './lib/env';

export const TOKEN: string = envHandler(process.env.DEV_TOKEN);
export const clientId: string = envHandler(process.env.DEV_CLIENT_ID);
export const guildId: string = envHandler(process.env.GUILD_ID);
export const DB_CONN_STRING: string = envHandler(process.env.DB_CONN_STRING);
export const FileExtension: string = envHandler(process.env.NODE_ENV) === 'production' ? '.js' : '.ts';
export const commandDirPath = path.resolve(__dirname, './commands');
export const eventsDirPath = path.resolve(__dirname, './events');

export const riotClientPlatform =
    'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9';

export const riotClientVersion = 'pbe-shipping-55-604424';
