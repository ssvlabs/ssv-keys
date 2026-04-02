import type { Namespace } from "argparse";
import type prompts from "prompts";

export interface InteractivePromptOptions
  extends Record<string, unknown> {
  type?: string;
  message?: string;
  required?: boolean;
}

export interface ActionArgumentInteractive {
  repeat?: string;
  repeatWith?: string[];
  validateList?: (items: unknown[]) => void;
  onSubmit?: (...args: unknown[]) => unknown;
  options: InteractivePromptOptions;
}

export interface ActionArgument {
  arg1: string;
  arg2: string;
  options: Record<string, unknown>;
  interactive?: ActionArgumentInteractive;
}

export interface ActionOptions {
  action: string;
  description?: string;
  example?: string;
  arguments: ActionArgument[];
}

export interface ActionExecutable {
  setArgs(args: Namespace): ActionExecutable;
  execute(): Promise<unknown> | unknown;
}

export interface ActionClass {
  new (): ActionExecutable;
  options: ActionOptions;
}

export type PromptValues = Record<string, unknown>;

export interface CompiledPromptOptions extends prompts.PromptObject<string> {
  type: prompts.PromptType;
  name: string;
  message: string;
  onSubmit?: (...args: unknown[]) => unknown;
}
