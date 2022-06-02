import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, Interaction, SelectMenuInteraction } from 'discord.js';

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

export interface LoginResponse {
    response: {
        parameters: {
            uri: string;
        };
    };
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
