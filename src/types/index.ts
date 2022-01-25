// For available regions
export enum region {
    ap = 'ap',
    na = 'na',
    eu = 'eu',
    kr = 'kr',
}

// Used in /models/user.model.ts for defining schema
export interface User {
    username: string;
    password: string;
    discordId: string;
    region: region;
    reminders?: string[];
}

// Used in /api/auth.ts for returning Headers object
export interface Headers {
    'Authorization': string;
    'X-Riot-Entitlements-JWT': string;
    'X-Riot-ClientPlatform': string;
    'X-Riot-ClientVersion': string;
}
