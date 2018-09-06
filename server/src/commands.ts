import { CLight, Light } from "./light";
import { HueApi } from "node-hue-api";
import { emitLightStatus } from "./emitLightStatus";

export interface CommandsJSON {
  ligths: CLight[]
}

interface CommandsConfig {
  api: HueApi
  socket: SocketIO.Server
}

export class Commands {

  name: string = ""
  ligths: Light[] = []
  api: HueApi
  socket: SocketIO.Server

  constructor(config: CommandsConfig) {
    this.api = config.api;
    this.socket = config.socket
  }

  fromJson(json: CommandsJSON) {
    this.ligths = json.ligths.map(l => {
      return new Light(l)
    })

    return this;
  }

  setSocket(socket: SocketIO.Server) {
    this.socket = socket;
  }

  run() {
    this.ligths.forEach(async (light) => {

      console.log("found " + light.commands.length + " commands")
      await light.runCommands(this.api, async () => {
        await emitLightStatus(this.api, this.socket)
      })

    })
  }

}