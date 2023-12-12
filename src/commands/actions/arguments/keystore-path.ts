/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
export default {
  arg1: '-kp',
  arg2: '--keystore-path',
  options: {
    required: false,
    type: String,
    help: 'The path to the folder containing validator keystore files'
  }
};
