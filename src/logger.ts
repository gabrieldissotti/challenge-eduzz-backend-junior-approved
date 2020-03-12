
import { Loggly } from 'winston-loggly-bulk';
import winston from 'winston';
import logglyConfig from './config/loggly';

const logger = winston.createLogger({
  transports: [
    new Loggly(logglyConfig.loggly),
    new winston.transports.Console({ level: 'info' })
  ]
})

const write = (info): void => {
  logger.info(info)
}

logger.stream = { write }

export default logger;
