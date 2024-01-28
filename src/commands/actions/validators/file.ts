import fs from 'fs';
import path from 'path';

export const fileExistsValidator = (filePath: string, message = ''): boolean | string => {
  filePath = sanitizePath(String(filePath).trim());
  try {
    fs.statSync(filePath);
    return true;
  } catch (error: any) {
    // Handle the error when the file does not exist
    return message || error.message || 'Couldn’t locate the keystore file.';
  }
};

export const jsonFileValidator = (filePath: string, message = ''): boolean | string => {
  let fileContents;
  filePath = sanitizePath(filePath);

  try {
    fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (e) {
    return message || 'Couldn’t read a validator keystore file';
  }
  try {
    JSON.parse(fileContents);
  } catch (e) {
    return `Keystore file "${filePath}" must be .JSON format`;
  }
  return true;
};

/**
 * Make sure the path contains
 * @param path
 * @param regex
 */
export const sanitizePath = (inputPath: string): string => {
  // Strip quotes from the beginning or end.
  const strippedPath = inputPath.replace(/^["']|["']$/g, '');

  // Normalize the path to resolve '..' and '.' segments.
  let sanitizedPath = path.normalize(strippedPath);

  // Remove any characters that are not typically allowed or are problematic in file paths.
  // Here, we're allowing alphanumeric characters, spaces, hyphens, underscores, and periods.
  // You can adjust the regex as needed.
  sanitizedPath = sanitizedPath.replace(/[^a-zA-Z0-9_\-./\\ ]/g, '');

  // On Windows, paths might start with a drive letter. We can check and ensure it's a valid drive letter.
  /*
  if (process.platform === 'win32') {
    const match = sanitizedPath.match(/^([a-zA-Z]:)/);
    if (match) {
      // Ensure the drive letter is uppercase (just a normalization step; not strictly necessary).
      sanitizedPath = match[1].toUpperCase() + sanitizedPath.substring(match[1].length);
    }
  }
  */

  return sanitizedPath;
};
