import mongoose from 'mongoose';
import { DB_CONN_STRING } from '../config';

async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(DB_CONN_STRING);
        console.log('Successfully connected to database');
    } catch (e) {
        const err = e as Error;
        console.log(`Error: ${err.message}`);
    }
}

export default connectToDatabase;
