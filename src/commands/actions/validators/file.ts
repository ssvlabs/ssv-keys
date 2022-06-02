import fs from 'fs';

export const fileExistsValidator = (filePath: string): boolean | string => {
  return fs.existsSync(filePath.trim()) ? true : 'File does not exists'
};
