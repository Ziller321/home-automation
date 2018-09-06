import { Command } from "./commands";
import { HueApi, lightState } from "node-hue-api"
import { Light } from "../light";



export interface SetColor { setColor: { r: number, g: number, b: number } }

export function isSetColor(a: Command): a is SetColor {
  return (a as SetColor).setColor !== undefined;
}

export async function setColor(api: HueApi, l: Light, a: SetColor) {
  const { r, g, b } = a.setColor
  await api.setLightState(l.id, lightState.create().rgb(r, g, b))
}

