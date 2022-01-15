import mongoose from 'mongoose';
import '../lib/env';
import { envHandler } from '../lib/errors';

export async function connectToDatabase(): Promise <void> {
    try {
        await mongoose.connect(envHandler(process.env.DB_CONN_STRING));
        console.log(`Successfully connected to database`);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}
