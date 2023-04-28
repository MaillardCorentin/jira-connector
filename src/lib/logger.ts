import winston from 'winston';

export function createLogger(file: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: file }),
    ],
  });
}
