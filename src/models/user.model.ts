import mongoose, { Schema } from 'mongoose';
import { User, Region, Account } from '../types';

const AccountSchema: Schema = new Schema<Account>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    region: { type: String, enum: Object.values(Region), required: true },
});

const UserSchema: Schema = new Schema<User>({
    discordId: { type: String, required: true, unique: true },
    accounts: [AccountSchema],
});

export default mongoose.model<User>('users', UserSchema);
