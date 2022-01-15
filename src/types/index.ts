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
    discord_id: Number;
    region: region;
    reminders?: string[];
}

// Used in /api/auth.ts for returning Headers object
export interface Headers {
    'X-Riot-Entitlements-JWT': string;
    'X-Riot-ClientPlatform': string;
    'X-Riot-ClientVersion': string;
}