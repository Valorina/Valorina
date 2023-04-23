// import { ComponentType } from 'discord-api-types/v10';
// import { MessageActionRow, Modal, ModalOptions, TextInputComponent } from 'discord.js';

import { Modal } from 'discord.js';

export const twoFAModal = (username: string): Modal =>
    new Modal({
        title: 'Two-Factor Authentication',
        customId: `twoFAHandler;${username}`,
        components: [
            {
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'TEXT_INPUT',
                        customId: 'code',
                        style: 'SHORT',
                        label: `Enter code sent to`,
                        maxLength: 6,
                        minLength: 6,
                        required: true,
                    },
                ],
            },
        ],
    });

export const SOMETHING = 1;
