export const supportedVersion = (value: string, message?: string): string | boolean => {
  const supportedVersions = ['2', '3'];

  if (supportedVersions.includes(value)) {
    return true;
  } else {
    return message || `Version ${value} is not supported`;
  }
};
