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
