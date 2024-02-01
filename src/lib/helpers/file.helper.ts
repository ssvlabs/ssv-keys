import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { promises as fsp } from 'fs';
import { SSVKeysException } from '../../lib/exceptions/base';

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
  fsp.writeFile(filePath, data, { encoding: 'utf-8' });
}

/**
 * Create SSV keys directory to work in scope of in user home directory
 */
export const createSSVDir = async (outputFolder: string): Promise<any> => {
  return fsp.mkdir(outputFolder, { recursive: true });
}

/**
 * Get SSV keys directory to work in scope of in user home directory.
 * Create it before, if it doesn't exist.
 */
export const getSSVDir = async (outputFolder: string): Promise<string> => {
  if (!fs.existsSync(outputFolder)) {
    await createSSVDir(outputFolder);
  }
  return outputFolder.endsWith(path.sep) ? outputFolder : `${outputFolder}${path.sep}`;
}

export const getFilePath = async (name: string, outputFolder: string, withTime = true): Promise<string> => {
  return `${await getSSVDir(outputFolder)}${name}${withTime ? `-${moment().unix()}` : ''}.json`;
}

export type KeyStoreFilesResult = {
  files: string[];
  isFolder: boolean;
}

export const getKeyStoreFiles = async (keystorePath: string): Promise<KeyStoreFilesResult> => {
  let isFolder = false;
  let files;

  try {
    // Attempt to open the directory to determine if the path is a folder
    const dir = await fsp.opendir(keystorePath);
    isFolder = true;
    files = [];

    for await (const dirent of dir) {
      files.push(path.join(keystorePath, dirent.name));
    }

    if (files.length === 0) {
      throw new SSVKeysException('No keystore files detected. Please provide a folder with correct keystore files and try again.');
    }
  } catch (error: any) {
    if (error.code === 'ENOTDIR') {
      // It's not a directory, assume it's a file path
      isFolder = false;
      files = [keystorePath];
    } else {
      // Other errors are re-thrown
      throw new SSVKeysException(error.message);
    }
  }

  files.sort(); // Sort the files array regardless of how it was populated
  return { files, isFolder };
}
