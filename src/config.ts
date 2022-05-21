import { envHandler } from './lib/env';
import path from 'path';

export const TOKEN: string = envHandler(process.env.DEV_TOKEN);
export const clientId: string = envHandler(process.env.DEV_CLIENT_ID);
export const guildId: string = envHandler(process.env.GUILD_ID);
export const DB_CONN_STRING: string = envHandler(process.env.DB_CONN_STRING)
export const FileExtension: string = envHandler(process.env.NODE_ENV) === 'production' ? '.js' : '.ts'
export const commandDirPath = path.resolve(__dirname, './commands');
export const eventsDirPath = path.resolve(__dirname, './events');