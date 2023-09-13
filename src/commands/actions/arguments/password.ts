// import { keystorePasswordValidator } from '../validators/keystore-password';

export default {
  arg1: '-ps',
  arg2: '--password',
  options: {
    required: true,
    type: String,
    help: 'The keystore file encryption password, if a folder was provided the password will be used for all keystore files in the folder'
  },
  interactive: {
    options: {
      type: 'password',
      message: 'Provide the keystore file password',
      /*
      validate: async (password: string): Promise<boolean | string> => {
        return await keystorePasswordValidator.validatePassword(password, true);
      },
      */
    }
  }
};
