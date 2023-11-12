import dayjs from 'dayjs';

export class Logger {
  public info(message: string, ...params: any[]) {
    console.info(`MDM - ${dayjs().format('HH:mm:ss')} [INFO ] ${message}`, ...params);
  }

  public debug(message: string, ...params: any[]) {
    console.log(`MDM - ${dayjs().format('HH:mm:ss')} [DEBUG] ${message}`, ...params);
  }
}

export const logger = new Logger();
