import userModel from '../models/user.model';
import { Document } from 'mongoose';

export const addUser = async (username: string, password: string, discordId: string, region: string): Promise<Document> => {
    return await userModel.create({
        username,
        password,
        discordId,
        region
    });
};