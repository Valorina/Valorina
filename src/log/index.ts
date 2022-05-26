import { createLogger, format, transports } from 'winston';
import { logDirPath } from '../config';

const { printf, combine, timestamp } = format;

const myFormat = printf(({ level, message, timestamp: tstamp }) => `${<number>tstamp} ${level}: ${message}`);

const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({ filename: `${logDirPath}/error.log`, level: 'error' }),
        new transports.File({ filename: `${logDirPath}/general.log` }),
        new transports.Console(),
    ],
});

export default logger;
