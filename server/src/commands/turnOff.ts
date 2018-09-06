import { Command } from "./commands";
import { HueApi, lightState } from "node-hue-api"
import { Light } from "../light";



export interface TurnOff { turnOff: boolean }

export function isTurnOff(a: Command): a is TurnOff {
  return (a as TurnOff).turnOff !== undefined;
}

export async function turnOff(api: HueApi, l: Light, a: TurnOff) {
  if (a.turnOff) {
    await api.setLightState(l.id, lightState.create().turnOff())
  }
}

