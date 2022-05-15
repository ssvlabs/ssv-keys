import fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;

/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
export const readFile = async (filePath: string, json=true): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err: ErrnoException | null, data: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(json ? JSON.parse(data) : data);
      }
    });
  });
}

/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param data
 */
export const writeFile = async (filePath: string, data: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, { encoding: 'utf8' }, (error) => {
      if (error) {
        reject({ error });
      } else {
        resolve({ filePath, data });
      }
    });
  });
}
