import { createLogger, format, transports } from 'winston';
const { printf, combine, timestamp, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(colorize(), timestamp(), logFormat),
    transports: [
        new transports.File({ filename: '../src/log/error.log', level: 'error' }),
        new transports.File({ filename: '../src/log/general.log' }),
        new transports.Console(),
    ],
});

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(
//         new transports.Console({
//             format: combine(colorize(), timestamp(), logFormat),
//         }),
//     );
// }

export default logger;
