import { Command } from "./commands";

export interface Sleep { sleep: number }

export function isSleep(a: Command): a is Sleep {
  return (a as Sleep).sleep !== undefined;
}

export async function sleep(a: Sleep) {
  await new Promise(resolve => setTimeout(resolve, a.sleep));
}