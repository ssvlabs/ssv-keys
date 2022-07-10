import fs from 'fs';

export const fileExistsValidator = (filePath: string): boolean | string => {
  return fs.existsSync(filePath.trim()) ? true : 'File does not exists'
};

export const jsonFileValidator = (filePath: string): boolean | string => {
  let fileContents;
  try {
    fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (e) {
    return 'Can not read file';
  }
  try {
    JSON.parse(fileContents);
  } catch (e) {
    return 'File is not a JSON file';
  }
  return true;
};
