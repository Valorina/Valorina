import userModel from '../models/user.model';
import { Account, CookieData, User } from '../types';

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

export const getCookie = async (discordId: string, username: string): Promise<CookieData> => {
    const userDb = await userModel.findOne({ discordId }).select({ accounts: { $elemMatch: { username } } });
    if (!userDb) throw new Error('Not possible to be here');
    return userDb.accounts[0].cookie;
};

export const updateCookie = async (discordId: string, username: string, cookie: string) => {
    const userDb = await userModel.updateOne(
        { discordId, 'accounts.username': username },
        { $set: { 'accounts.$.cookie.cookie': cookie, 'accounts.$.cookie.expiredAt': Date.now() } },
    );
    console.log(userDb);
};
