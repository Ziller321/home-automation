import { Command } from "./commands";

export interface Repeat {
  repeat: number
  commands: Command[]
}

export function isRepeat(a: Command): a is Repeat {
  return (a as Repeat).repeat !== undefined;
}