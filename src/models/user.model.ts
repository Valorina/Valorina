import mongoose, { Schema } from 'mongoose';
import { User, region } from '../types/';

const UserSchema: Schema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    discord_id: { type: Number, required: true },
    region: { type: String, enum: Object.values(region), required: true },
    reminders: { type: [{ type: String }] },
});

export default mongoose.model<User>('users', UserSchema);
