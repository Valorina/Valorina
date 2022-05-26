import { Client } from 'discord.js';
import logger from '../log';
import connectToDatabase from '../services/database';

export default {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        await connectToDatabase();
        logger.info(`Ready! Logged in as ${client.user!.tag}`);
    },
};
