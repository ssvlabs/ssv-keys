import { ArgumentOptions, Namespace } from 'argparse';
import { SSVKeysException } from '../../lib/exceptions/base';

export interface ActionArgument {
  arg1: string,
  arg2: string,
  options: ArgumentOptions
}

export interface ActionOptions {
  action: string,
  // shortAction: string,
  arguments: ActionArgument[]
}

export class BaseAction {
  protected args: Namespace = {};

  setArgs(args: Namespace): BaseAction {
    this.args = args;
    return this;
  }

  async execute(): Promise<any> {
    throw new SSVKeysException('Should implement "execute"')
  }

  static get options(): any {
    throw new SSVKeysException('Should implement static "options"');
  }

  get options(): any {
    return BaseAction.options;
  }

  /**
   * Pre-execution method which can be run before execution logic.
   */
  preExecute(): void {
    return;
  }

  /**
   * Pre-options reading method which can be run before the logic where options read happened.
   * Should also return options which can be changed.
   * @param options
   */
  async preOptions(options: any): Promise<any> {
    return options;
  }
}
