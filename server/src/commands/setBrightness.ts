import { Command } from "./commands";
import { HueApi, lightState } from "node-hue-api";
import { Light } from "../light";


export interface SetBrightness { setBrightness: number }

export function isSetBrightness(a: Command): a is SetBrightness {
  return (a as SetBrightness).setBrightness !== undefined;
}

export async function setBrightness(api: HueApi, l: Light, a: SetBrightness) {
  await api.setLightState(l.id, lightState.create().brightness(a.setBrightness))
}