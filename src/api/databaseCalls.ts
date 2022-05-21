import userModel from '../models/user.model';
import { Document } from 'mongoose';
import { User } from '../types';

export const getUsers = async (discordId: string): Promise<User[] | undefined> => {
    const users: User[] = await userModel.find({ discordId: discordId });
    if (users.length === 0) {
        return;
    }
    return users;
};

export const addUser = async (
    username: string,
    password: string,
    discordId: string,
    region: string,
): Promise<Document> => {
    return await userModel.create({
        username,
        password,
        discordId,
        region,
    });
};
