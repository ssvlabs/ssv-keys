import { SSVKeysException } from "@ssv-labs/ssv-sdk";
import { Namespace } from "argparse";
import type { ActionOptions } from "../types";

export class BaseAction {
  protected args = {} as Namespace;

  setArgs(args: Namespace): this {
    this.args = args;
    return this;
  }

  async execute(): Promise<unknown> {
    throw new SSVKeysException('Should implement "execute"');
  }

  static get options(): ActionOptions {
    throw new SSVKeysException('Should implement static "options"');
  }
}
