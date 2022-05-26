import mongoose from 'mongoose';
import { DB_CONN_STRING } from '../config';
import logger from '../log';

async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(DB_CONN_STRING);
        logger.info('Successfully connected to database');
    } catch (e) {
        const err = e as Error;
        logger.error(`Module:connectToDatabase, Error: ${err.message}`);
    }
}

export default connectToDatabase;
