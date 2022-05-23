import { Document } from 'mongoose';
import userModel from '../models/user.model';
import { Account, User } from '../types';

export const getUserAccounts = async (discordId: string): Promise<User | null> => {
    const users: User | null = await userModel.findOne({ discordId });
    return users;
};

// TODO: Fix Error if user already exists
export const addUser = async (user: User, account: Account): Promise<Document> =>
    userModel.findOneAndUpdate(
        { discordId: user.discordId, 'accounts.username': { $nin: [account.username] } },
        { $push: { accounts: account } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    );
