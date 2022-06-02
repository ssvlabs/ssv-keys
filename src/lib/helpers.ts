import fs from 'fs';
import path from 'path';
import * as os from 'os';
import { promises as fsp } from 'fs';
import moment from 'moment';

/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
export const readFile = async (filePath: string, json=true): Promise<any> => {
  return fsp.readFile(filePath, { encoding: 'utf-8' }).then((data) => {
    return json ? JSON.parse(data) : data;
  });
}

/**
 * Write file contents.
 * @param filePath
 * @param data
 */
export const writeFile = async (filePath: string, data: string): Promise<any> => {
  return fsp.writeFile(filePath, data, { encoding: 'utf-8' }).then(() => {
    return { filePath, data };
  });
}

const ssvDir = `${path.join(os.homedir(), '.ssv', 'keys')}${path.sep}`;

/**
 * Create SSV keys directory to work in scope of in user home directory
 */
export const createSSVDir = async (): Promise<any> => {
  return fsp.mkdir(ssvDir, { recursive: true });
}

/**
 * Get SSV keys directory to work in scope of in user home directory.
 * Create it before, if it doesn't exists.
 */
export const getSSVDir = async (): Promise<string> => {
  if (!fs.existsSync(ssvDir)) {
    await createSSVDir();
  }
  return ssvDir;
}

export const getFilePath = async (name: string, withTime = true): Promise<string> => {
  return `${await getSSVDir()}${name}${withTime ? '-' + moment().format('YYYYMMDD_hhmmss') : ''}.json`;
}
