import { Client, Intents } from 'discord.js';
import './lib/env';

const TOKEN = process.env.TOKEN;
// const TOKEN = process.env.DEV_TOKEN; DEV TOKEN

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    console.log('Ready!');
});

client.login(TOKEN);
