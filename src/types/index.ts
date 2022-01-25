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
