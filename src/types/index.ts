import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, Interaction, ModalSubmitInteraction, SelectMenuInteraction } from 'discord.js';

// For available regions
export enum Region {
    ap = 'ap',
    na = 'na',
    eu = 'eu',
    kr = 'kr',
}

// Used in /models/user.model.ts for defining schema
export interface Account {
    username: string;
    password: string;
    region: Region;
    cookie: CookieData;
}

export interface CookieData {
    cookie: string;
    expiryAt: number;
}

export interface User {
    discordId: string;
    accounts: Account[];
}

export interface Reminders {
    discordId: string;
    reminders?: string[];
}

export interface StoreResponse {
    SkinsPanelLayout: {
        SingleItemOffers: string[];
        SingleItemOffersRemainingDurationInSeconds: number;
    };
}

export interface SkinDataResponse {
    data: {
        displayName: string;
        streamedVideo?: string;
        displayIcon: string;
    };
}

export interface LoginSuccessResponse {
    type: 'auth' | 'multifactor' | 'response';
    response: {
        parameters: {
            uri: string;
        };
    };
    country: string;
    cookies: string;
    error: undefined;
}

export interface LoginFailureResponse {
    type: 'auth' | 'multifactor';
    error: string;
    country: string;
    response: undefined;
    cookies: undefined;
}

export interface CommandType {
    data: SlashCommandBuilder;
    execute: (args0: CommandInteraction) => Promise<void>;
}

export interface EventType {
    name: string;
    once?: boolean;
    execute: (args0: Client, args1?: Interaction) => Promise<void>;
}

export interface SelectMenuType {
    name: string;
    execute: (args0: SelectMenuInteraction, args1: string[]) => Promise<void>;
}

export interface ModalSubmitType {
    name: string;
    execute: (args0: ModalSubmitInteraction, args1: string[]) => Promise<void>;
}
