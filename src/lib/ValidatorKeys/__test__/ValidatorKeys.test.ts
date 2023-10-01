import {
  getValidatorKeysFromMnemonic,
  getValidatorKeysFromSeed,
  ValidatorKeys
} from '../index';


const mnemonic = 'grit much shy brown gorilla mail mammal slam expire alarm hour swap drive garment trial vacant direct novel list magic canvas elbow program humble';
/**
 * Seed has been generated by keyvault-cli using:
 * ./keyvault-cli seed generate --mnemonic="..."
 */
const seed = '981760c28a8ce4413433692c822412a46589280aaa723505f49c448618650327cc6ad4c12b4ee91307aeeb19e4799a51c6739bed4d5863e2643c3278a82393a9';
const KEYS_TO_GENERATE = 10;

/**
 * Test for generation of validator public and private keys
 * Uses two approaches: from mnemonic and from seed, making sure that results are the same.
 * Public keys was also compared with output from keyvault-cli:
 *
 *    ./keyvault-cli wallet account create --accumulate=true --index=5 --response-type=object --highest-source=1,2,3,4,5,6 --highest-target=2,3,4,5,6,7 --highest-proposal=2,3,4,5,6,7 --network=prater --seed=...
 */
describe('Generation of validator public and private keys', () => {
  let keysFromMnemonic: ValidatorKeys[] = [];
  let keysFromSeed: ValidatorKeys[] = [];

  it('should happen from mnemonic', async () => {
    // Mnemonic currently gives correct result
    keysFromMnemonic = await getValidatorKeysFromMnemonic(mnemonic, KEYS_TO_GENERATE);
    expect(keysFromMnemonic.length).toEqual(KEYS_TO_GENERATE);
  });

  it('should happen from seed', async () => {
    keysFromSeed = await getValidatorKeysFromSeed(seed, KEYS_TO_GENERATE);
    expect(keysFromSeed.length).toEqual(KEYS_TO_GENERATE);
  });

  it('should be the same from seed and mnemonic', () => {
    expect(keysFromSeed.length).not.toEqual(0);
    expect(keysFromMnemonic.length).not.toEqual(0);

    keysFromMnemonic.map((key, index) => {
      expect(key.index).toEqual(index);
      expect(key.privateKey).toEqual(keysFromSeed[index].privateKey);
      expect(key.publicKey).toEqual(keysFromSeed[index].publicKey);
    });
  });
});
