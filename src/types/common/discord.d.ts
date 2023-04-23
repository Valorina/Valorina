import { Collection } from 'discord.js';
import { CommandType, ModalSubmitType, SelectMenuType } from '..';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, CommandType>;
        menus: Collection<string, SelectMenuType>;
        modals: Collection<string, ModalSubmitType>;
    }
}
