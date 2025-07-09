import { Arguments } from 'yargs';
import { SSVKeysException } from '../../main';

export interface ActionArgument {
  arg1: string;
  arg2: string;
  options: {
    alias?: string;
    describe?: string;
    type?: 'string' | 'number' | 'boolean';
    demandOption?: boolean;
    default?: any;
  };
}

export interface ActionOptions {
  action: string;
  arguments: ActionArgument[];
  description?: string;
}

export class BaseAction {
  protected args: Arguments = {};

  setArgs(args: Arguments): BaseAction {
    this.args = args;
    return this;
  }

  async execute(): Promise<any> {
    throw new SSVKeysException('Should implement "execute"');
  }

  static get options(): ActionOptions {
    throw new SSVKeysException('Should implement static "options"');
  }

  get options(): ActionOptions {
    return (this.constructor as typeof BaseAction).options;
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

  /**
   * Optional help footer that can be used by CLI classes
   */
  static helpFooter: string = '';
}
