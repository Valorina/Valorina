import userModel from '../models/user.model';
import { Account, User } from '../types';

export const getUserAccounts = async (discordId: string): Promise<User | null> => {
    const users: User | null = await userModel.findOne({ discordId });
    return users;
};

export const addUser = async (discordId: string, account: Account): Promise<boolean> => {
    const userDb = await userModel.findOne({ discordId });
    if (!userDb) {
        await userModel.create({
            discordId,
            accounts: [account],
        });
        return true;
    }
    const { accounts } = userDb;
    const dbAccount = accounts.find((Dbaccount) => Dbaccount.username === account.username);
    if (dbAccount) {
        return false;
    }
    await userModel.updateOne({ discordId }, { $push: { accounts: account } });
    return true;
};
