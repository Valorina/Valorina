import userModel from '../models/user.model';
import { User } from '../types';

export const getUsers = async (discordId: string): Promise<User[] | undefined> => {
    const users: User[] = await userModel.find({ discordId: discordId }); 
    if (users.length===0) {
        return
    }
    return users;
};
