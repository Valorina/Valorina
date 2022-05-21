import mongoose from 'mongoose';
import { DB_CONN_STRING } from '../config';

export async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(DB_CONN_STRING);
        console.log('Successfully connected to database');
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}
