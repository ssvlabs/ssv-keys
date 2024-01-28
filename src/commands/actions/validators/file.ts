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

export const sanitizePath = (inputPath: string): string => {
  // Strip quotes from the beginning or end of the path.
  const strippedPath = inputPath.replace(/^["']|["']$/g, '');

  // Normalize the path to handle different OS path formats and resolve '..' and '.' segments.
  let sanitizedPath = path.normalize(strippedPath);

  // Optionally, expand the regex to allow additional valid characters as needed.
  // The current regex allows alphanumeric, spaces, hyphens, underscores, periods, and path separators.
  // Modify this regex based on your specific requirements.
  sanitizedPath = sanitizedPath.replace(/[^a-zA-Z0-9 _\-.\\\/]/g, '');

  // Handle Windows-specific path formatting (like drive letters).
  if (process.platform === 'win32') {
    console.log('[debug] windows');
    const driveLetterMatch = sanitizedPath.match(/^([a-zA-Z]:)/);
    if (driveLetterMatch) {
      // Normalize the drive letter to uppercase.
      sanitizedPath = driveLetterMatch[1].toUpperCase() + sanitizedPath.substring(driveLetterMatch[1].length);
    }
    console.log('[debug] windows sanitizedPath:', sanitizedPath);
  }

  return sanitizedPath;
};
