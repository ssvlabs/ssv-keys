import dotenv from 'dotenv';
import { constants } from 'http2';
import bodyParser from 'body-parser';
import { SSVKeys, KeyShares, KeySharesItem } from 'ssv-keys';
import express, { Express, Request, Response } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const ssvKeys = new SSVKeys();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/key-shares/generate', async (req: Request, res: Response) => {
  const operator_ids = String(req.body['operator_ids'] || '')
    .split(',')
    .map((id) => Number(id.trim()))
    .filter(id => !!id);

  if (!operator_ids.length) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Operator IDs required' });
  }

  const operator_keys = String(req.body['operator_keys'] || '')
    .split(',')
    .map((key) => key.trim())
    .filter(key => !!key);

  if (!operator_keys.length) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Operator keys required' });
  }

  const keystore = req.body['keystore'];

  if (!keystore) {

    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Keystore is required' });
  }

// The nonce of the owner within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool
  const nonce = Number(req.body['nonce']);

  if (isNaN(nonce)) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Nonce is required' });
  }

  // The owner address for signing the share payload
  const owner_address = String(req.body['owner_address']);

  if (!owner_address) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'owner_address is required' });
  }

  const password = String(req.body['password'] || '');

  if (!password.length) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Keystore password is required' });
  }

  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystore, password);

  const operators = operator_keys.map((operatorKey, index) => ({
    id: operator_ids[index],
    operatorKey,
  }));

  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  // Build final web3 transaction payload and update keyshares file with payload data
  const keySharesItem = new KeySharesItem();
  keySharesItem.update({
    ownerAddress: owner_address,
    ownerNonce: nonce,
    operators,
    publicKey
  });

  // The cluster owner address
  await keySharesItem.buildPayload({
    publicKey,
    operators,
    encryptedShares,
  },{
    ownerAddress: owner_address,
    ownerNonce: nonce,
    privateKey
  });

  const keyShares = new KeyShares();
  keyShares.add(keySharesItem);

  console.log(`Built key shares for operators: ${String(operator_ids)} and public key: ${keystore.pubkey}`);
  res.json(JSON.parse(keyShares.toJson()));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
