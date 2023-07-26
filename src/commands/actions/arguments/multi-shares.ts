const keyStorePathData: any = {};

export const updateKeyStorePathData = (isFolder: boolean, filesCount: number) => {
  keyStorePathData.isFolder = isFolder;
  keyStorePathData.filesCount = filesCount;
};

export default {
  arg1: '-ms',
  arg2: '--multi-shares',
  options: {
    action: 'store_true',
    default: false,
    required: false,
    help: 'Keystore path will accept multiple keystores from a folder path, all files must have the same password.'
  }
};
