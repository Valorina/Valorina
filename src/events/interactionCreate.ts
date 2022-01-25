import { Client, Interaction } from 'discord.js';
import { exceptionEmbed } from '../lib/embeds';
export default {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (interaction.isCommand()) {
            const { default: command } = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                await interaction.channel?.send({ embeds: [exceptionEmbed()] });
            }
        }
        else if(interaction.isSelectMenu()){
            console.log(interaction);
        }
        else{
            return;
        }
    },
};
