require('dotenv').config()
import { HueApi, lightState } from "node-hue-api"
import express from 'express';
import http from 'http'
import socketio from 'socket.io'
import { CronJob } from 'cron'

const app = express();
const server = new http.Server(app)

var io = socketio(server);

const host = process.env.host || ""
const user = process.env.user || ""
const api = new HueApi(host, user);

console.log("Start", host, user)

// 0 7 * * 1-5

new CronJob('0 7 * * 1-5', function () {
  // console.log('You will see this message every second');

  const commands: Commands = {
    ligths: [
      {
        id: '2',
        actions: ['turnOn', { action: 'setColor', value: { r: 255, g: 255, b: 255 } }]
      },
      {
        id: '6',
        actions: ['turnOn', { action: 'setColor', value: { r: 255, g: 255, b: 255 } }]
      },
      {
        id: '3',
        actions: ['turnOn', { action: 'setColor', value: { r: 255, g: 255, b: 255 } }]
      }
    ]
  }
  runCommands()({
    commands
  })
}, undefined, true, 'Europe/Helsinki');

interface SuperSocket extends socketio.Socket {
  sendToAll: (event: string | symbol, ...args: any[]) => void
}

async function emitScenes() {
  const scenes = await api.getScenes();
  io.emit('scenes', scenes)
}

async function emitLightStatus() {
  api.lights().then(ligthsResponse => {
    io.emit('light-list', ligthsResponse.lights)
    ligthsResponse.lights.forEach(l => {
      io.emit(`light-status-${l.id}`, l)
    })
  })
}


export interface Commands {
  ligths: Array<{
    id: string,
    actions: (
      string |
      { action: 'setColor', value: { r: number, g: number, b: number } } |
      { action: 'sleep', value: number } |
      { action: 'setBrightness', value: number }
    )[]
  }>
}

const runTest = () => async (data: {}) => {
  const test: Commands = {
    ligths: [
      {
        id: '2',
        actions: [
          'turnOn',
          { action: 'setColor', value: { r: 255, g: 255, b: 255 } },
          { action: 'setBrightness', value: 70 }
        ]
      }
    ]
  }

  runCommands()({ commands: test })
}

const runCommands = () => async (data: { commands: Commands }) => {

  const { commands } = data;

  console.log('commands', commands)

  // For lights
  commands.ligths.forEach(async (l) => {
    console.log("found " + l.actions.length + " commands")
    for (const a of l.actions) {
      console.log("action -> ", a)

      if (typeof a === 'string') {
        if (a === 'turnOn') {
          await api.setLightState(l.id, lightState.create().turnOn())
        } else if (a === 'turnOff') {
          await api.setLightState(l.id, lightState.create().turnOff())
        } else if (a === 'toggle') {

          const li = await api.getLightStatus(l.id)

          if (li.state.on) {
            await api.setLightState(l.id, lightState.create().turnOff())
          } else {
            await api.setLightState(l.id, lightState.create().turnOn())
          }
        }
      } else {
        if (a.action === "sleep") {
          await new Promise(resolve => setTimeout(resolve, a.value));
        } else if (a.action === "setColor") {
          await api.setLightState(l.id, lightState.create().rgb(a.value.r, a.value.g, a.value.b))
        } else if (a.action === "setBrightness") {
          await api.setLightState(l.id, lightState.create().brightness(a.value))
        }
      }

      await emitLightStatus()
    }

  })


}



io.on('connection', (socket: SuperSocket) => {
  console.log("Client connected")
  // Emit & Broadcast, seems both needed

  // socket.sendToAll = function sendToAll(event: string | symbol, ...args: any[]) {
  //   this.emit(event, ...args)
  //   this.broadcast.emit(event, ...args)
  // }

  emitScenes();
  emitLightStatus();

  socket.on('runCommands', runCommands())

  socket.on('runTest', runTest())

  // arpScanner = setInterval(() => {
  //   scanner(socket);
  // }, 5000)

});

let arpScanner = null;

let arpList: boolean[] = []

const scanner = async (socket: SuperSocket) => {
  const { exec } = require('child_process');
  exec('arp-scan --interface=en0 --localnet', (err: any, stdout: any, stderr: any) => {
    if (err) {
      return;
    }
    console.log()

    const atHome = Boolean(stdout.includes("b0:ca:68:71:4d:2a"))
    console.log("atHome? ", atHome, arpList.length)

    if (atHome) {
      arpList = [
        ...arpList.filter(x => x),
        atHome
      ]

      if (arpList.length > 4) {
        runCommands()({
          commands: {
            ligths: [{
              id: '2',
              actions: ['turnOn']
            }]
          }
        })
      }

    } else {
      arpList = [
        ...arpList.filter(x => !x),
        atHome
      ]

      if (arpList.length > 4) {
        runCommands()({
          commands: {
            ligths: [{
              id: '2',
              actions: ['turnOff']
            }]
          }
        })
      }
    }
  });
}





server.listen(3001, () => console.log('Home automation server running at 3001'))


