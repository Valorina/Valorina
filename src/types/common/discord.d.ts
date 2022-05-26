import { Collection } from 'discord.js';
import { CommandType } from '..';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, CommandType>;
    }
}
