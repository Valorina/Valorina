import { Collection } from 'discord.js';
import { CommandType, SelectMenuType } from '..';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, CommandType>;
        menus: Collection<string, SelectMenuType>;
    }
}
