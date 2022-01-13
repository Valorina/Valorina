import { Client, CommandInteraction } from 'discord.js';

export default {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction,client:Client) {
        if (!interaction.isCommand()) return;
        
        const { default: command } = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
