import path from "path";
import {
  createUtils,
  OperatorsCountsMismatchError,
  SSVKeysException,
} from "@ssv-labs/ssv-sdk";

import { BaseAction } from "./BaseAction";
import type { ActionOptions } from "../types";
import { sanitizePath, keystorePasswordValidator } from "./validators";
import {
  keystoreArgument,
  ownerNonceArgument,
  operatorIdsArgument,
  ownerAddressArgument,
  keystorePasswordArgument,
  outputFolderArgument,
  operatorPublicKeysArgument,
} from "./arguments";
import { getFilePath, getKeyStoreFiles, readFile } from "../../file.helper";
import { parseOperatorIdsCsv } from "../../shared/operator-ids";

type Operator = {
  id: number;
  operatorKey: string;
};

const NO_VALID_KEYSTORES_ERROR =
  "Unable to locate valid keystore files. Please verify that the keystore files are valid and the password is correct.";
const GENERATING_KEYSHARES_MESSAGE =
  "\n\nGenerating Keyshares file, this might take a few minutes do not close terminal.";
const offlineSdkUtils = createUtils({} as never);

/**
 * Command to build keyshares from user input.
 */
export class KeySharesAction extends BaseAction {
  static override get options(): ActionOptions {
    return {
      action: "shares",
      description:
        "Generate shares for a list of operators from a validator keystore file",
      example: `Example:
  ssv-keys shares \\
    -ks "./validator_keys" \\
    -ps "KEYSTORE_PASSWORD" \\
    -oids "5,6,7,8" \\
    -oks "LS0...,LS0...,LS0...,LS0..." \\
    -oa "0x1111111111111111111111111111111111111111" \\
    -on "105" \\
    -of "./tmp-keyshares-hoodi"`,
      arguments: [
        keystoreArgument,
        keystorePasswordArgument,
        operatorIdsArgument,
        operatorPublicKeysArgument,
        outputFolderArgument,
        ownerAddressArgument,
        ownerNonceArgument,
      ],
    };
  }

  override async execute(): Promise<string> {
    this.validateArguments();
    return this.executeOffline();
  }

  private validateArguments(): void {
    const hasKeystore = !!this.args.keystore;
    if (!hasKeystore) {
      throw new SSVKeysException(
        "Please provide a path to the validator keystore file or to the folder containing multiple validator keystore files."
      );
    }

    if (!this.hasOperatorKeys()) {
      throw new SSVKeysException(
        "Operator keys are required to generate shares in offline mode."
      );
    }
  }

  private async validateKeystoreFiles(files: string[]): Promise<string[]> {
    const validatedFiles = [];
    let failedValidation = 0;
    for (const [index, file] of files.entries()) {
      const isKeyStoreValid =
        await keystoreArgument.interactive.options.validate(file);
      const isValidPassword = await keystorePasswordValidator.validatePassword(
        this.args.password,
        file
      );
      let status = "✅";
      if (isKeyStoreValid === true && isValidPassword === true) {
        validatedFiles.push(file);
      } else {
        failedValidation++;
        status = "❌";
      }
      const fileName = path.basename(file); // Extract the file name
      process.stdout.write(
        `\r\n${index + 1}/${files.length} ${status} ${fileName}`
      );
    }
    process.stdout.write(
      `\n\n${files.length - failedValidation} of ${
        files.length
      } keystore files successfully validated. ${failedValidation} failed validation`
    );

    process.stdout.write("\n");
    return validatedFiles;
  }

  private hasOperatorKeys(): boolean {
    return (
      typeof this.args.operator_keys === "string" &&
      this.args.operator_keys.trim().length > 0
    );
  }

  private getOperatorIds(): number[] {
    return parseOperatorIdsCsv(this.args.operator_ids);
  }

  private getOperatorsFromArgs(): Operator[] {
    const operatorIds = this.getOperatorIds();
    const operatorKeys = String(this.args.operator_keys)
      .split(",")
      .map((operatorKey) => operatorKey.trim());

    if (operatorIds.length !== operatorKeys.length) {
      throw new OperatorsCountsMismatchError(
        operatorIds,
        operatorKeys,
        "Mismatch amount of operator ids and operator keys."
      );
    }

    if (operatorKeys.includes("")) {
      throw new SSVKeysException(
        "Operator keys cannot contain empty strings."
      );
    }

    if (new Set(operatorKeys).size !== operatorKeys.length) {
      throw new SSVKeysException("Operator keys must be unique.");
    }

    return operatorIds.map((id: number, index: number) => {
      const operatorKey = operatorKeys[index];
      return { id, operatorKey };
    });
  }

  private async getValidatedKeystoreFiles(): Promise<string[]> {
    const keystorePath = sanitizePath(String(this.args.keystore).trim());
    const { files } = await getKeyStoreFiles(keystorePath);
    return this.validateKeystoreFiles(files);
  }

  private async readValidatedKeystoreData(): Promise<string[]> {
    const validatedFiles = await this.getValidatedKeystoreFiles();
    return Promise.all(validatedFiles.map((file) => readFile(file, false)));
  }

  private async executeOffline(): Promise<string> {
    const operatorIds = this.getOperatorIds();
    const operators = this.getOperatorsFromArgs();
    const keystores = await this.readValidatedKeystoreData();

    if (keystores.length === 0) {
      throw new SSVKeysException(NO_VALID_KEYSTORES_ERROR);
    }

    process.stdout.write(GENERATING_KEYSHARES_MESSAGE);

    const shares = await offlineSdkUtils.generateKeyShares({
      keystore: keystores,
      keystorePassword: this.args.password,
      operatorKeys: operators.map((operator) => operator.operatorKey),
      operatorIds,
      ownerAddress: this.args.owner_address,
      nonce: this.args.owner_nonce,
    });

    const keySharesFilePath = await getFilePath(
      "keyshares",
      this.args.output_folder.trim()
    );
    await offlineSdkUtils.writeKeysharesFile({
      path: keySharesFilePath,
      shares,
      ownerAddress: this.args.owner_address,
      nonce: this.args.owner_nonce,
      operators,
    });

    return keySharesFilePath;
  }
}
