import { Command } from "./commands";
import { HueApi, lightState } from "node-hue-api"
import { Light } from "../light";



export interface Toggle { toggle: boolean }

export function isToggle(a: Command): a is Toggle {
  return (a as Toggle).toggle !== undefined;
}

export async function toggle(api: HueApi, l: Light, a: Toggle) {
  if (a.toggle) {
    const li = await api.getLightStatus(l.id)

    if (li.state.on) {
      await api.setLightState(l.id, lightState.create().turnOff())
    } else {
      await api.setLightState(l.id, lightState.create().turnOn())
    }
  }
}

