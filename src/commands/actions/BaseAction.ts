import { ArgumentOptions, Namespace } from 'argparse';
import { SSVKeys } from '../../lib/SSVKeys';


export interface ActionArgument {
  arg1: string,
  arg2: string,
  options: ArgumentOptions
}

export interface ActionOptions {
  action: string,
  shortAction: string,
  arguments: ActionArgument[]
}

export class BaseAction {
  public ssvKeys: any = new SSVKeys();
  protected args: Namespace = {};

  setArgs(args: Namespace): BaseAction {
    this.args = args;
    return this;
  }

  async execute(): Promise<any> {
    throw Error('Should implement "execute"')
  }

  static get options(): ActionOptions {
    throw Error('Should implement "options"');
  }
}
