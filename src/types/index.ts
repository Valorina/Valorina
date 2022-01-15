export enum region {
    ap = 'ap',
    na = 'na',
    eu = 'eu',
    kr = 'kr',
}

export interface User {
    username: string;
    password: string;
    discord_id: Number;
    region: region;
    reminders?: string[];
}
