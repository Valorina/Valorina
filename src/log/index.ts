import { createLogger, format, transports } from 'winston';

const { printf, combine, timestamp, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

const logger = createLogger({
    level: 'info',
    format: combine(colorize(), timestamp(), logFormat),
    transports: [
        new transports.File({ filename: '../src/log/error.log', level: 'error' }),
        new transports.File({ filename: '../src/log/general.log' }),
        new transports.Console(),
    ],
});

export default logger;
