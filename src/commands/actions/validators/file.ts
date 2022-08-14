import fs from 'fs';

export const fileExistsValidator = (filePath: string, message = ''): boolean | string => {
  return fs.existsSync(filePath.trim()) ? true : message || 'File does not exists';
};

export const jsonFileValidator = (filePath: string, message = ''): boolean | string => {
  let fileContents;
  try {
    fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (e) {
    return message || 'Can not read file';
  }
  try {
    JSON.parse(fileContents);
  } catch (e) {
    return message || 'File is not a JSON file';
  }
  return true;
};
