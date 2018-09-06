import { Command } from "./commands/commands";
import { HueApi } from "node-hue-api";
import { isSetColor, setColor } from "./commands/setColor";
import { isSleep, sleep } from "./commands/sleep";
import { isSetBrightness, setBrightness } from "./commands/setBrightness";
import { isTurnOn, turnOn } from "./commands/turnOn";
import { isTurnOff, turnOff } from "./commands/turnOff";
import { isToggle, toggle } from "./commands/toggle";
import { isRepeat } from "./commands/repeat";

export interface CLight {
  id: string,
  commands: Command[]
}

export class Light {
  public id: string
  public commands: Command[]

  constructor({ id, commands }: CLight) {
    this.id = id;
    this.commands = commands
  }



  public async runCommands(api: HueApi, afterCommand: () => void = () => { /* fuck u linter*/ }) {
    for (const a of this.commands) {

      console.log("run -> ", a)

      if (isRepeat(a)) {
        for (let index = 0; index < a.repeat; index++) {
          for (const repeatCommand of a.commands) {
            await this.runSingleCommand(api, repeatCommand)
          }
        }
      }

      await this.runSingleCommand(api, a)
      afterCommand()
    }
  }

  private runSingleCommand(api: HueApi, a: Command) {
    if (isSetColor(a)) {
      return setColor(api, this, a);
    }

    if (isSleep(a)) {
      return sleep(a)
    }

    if (isSetBrightness(a)) {
      return setBrightness(api, this, a)
    }

    if (isTurnOn(a)) {
      return turnOn(api, this, a)
    }

    if (isTurnOff(a)) {
      return turnOff(api, this, a)
    }

    if (isToggle(a)) {
      return toggle(api, this, a)
    }

    return Promise.resolve()
  }
}