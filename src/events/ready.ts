import { Client } from 'discord.js';
import logger from '../log';
import connectToDatabase from '../services/database';
import { EventType } from '../types';

export = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        await connectToDatabase();
        if (client.user !== null) {
            client.user.setActivity({
                name: '/help',
                type: 'LISTENING',
            });
            logger.info(`Ready! Logged in as ${client.user.tag}`);
        }
    },
} as EventType;
