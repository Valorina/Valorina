import { Client } from 'discord.js';
import { connectToDatabase } from '../services/database';

export default {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        await connectToDatabase();
        console.log(`Ready! Logged in as ${client.user!.tag}`);
    },
};
