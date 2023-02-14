import dotenv from 'dotenv';
import { constants } from 'http2';
import bodyParser from 'body-parser';
import { SSVKeys } from 'ssv-keys';
import express, { Express, Request, Response } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

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

  const password = String(req.body['password'] || '');

  if (!password.length) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Keystore password is required' });
  }

  const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
  const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystore, password)
  const encryptedShares = await ssvKeys.buildShares(privateKey, operator_ids, operator_keys);

  // Build final web3 transaction payload and update keyshares file with payload data
  const payload = await ssvKeys.buildPayload(
    {
      publicKey: ssvKeys.publicKey,
      operator_ids,
      encryptedShares,
    }
  );
  const keyShares = ssvKeys.keyShares.fromJson({
    version: 'v3',
    data: {
      operators: operator_keys.map((operator, index) => ({
        id: operator_ids[index],
        publicKey: operator,
      })),
      publicKey: ssvKeys.publicKey,
      encryptedShares,
    },
    payload,
  });
  console.log(`Built key shares for operators: ${String(operator_ids)} and public key: ${keystore.pubkey}`);
  res.json(JSON.parse(keyShares.toJson()));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
