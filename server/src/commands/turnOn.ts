import { Command } from "./commands";
import { HueApi, lightState } from "node-hue-api"
import { Light } from "../light";



export interface TurnOn { turnOn: boolean }

export function isTurnOn(a: Command): a is TurnOn {
  return (a as TurnOn).turnOn !== undefined;
}

export async function turnOn(api: HueApi, l: Light, a: TurnOn) {
  if (a.turnOn) {
    await api.setLightState(l.id, lightState.create().turnOn())
  }
}

