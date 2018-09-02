import { HueApi, lightState } from "node-hue-api"
import express from 'express';
import http from 'http'
import socketio from 'socket.io'

const app = express();
const server = new http.Server(app)

var io = socketio(server);

const host = process.env.host || ""
const user = process.env.user || ""
const api = new HueApi(host, user);

interface SuperSocket extends socketio.Socket {
  sendToAll: (event: string | symbol, ...args: any[]) => void
}

async function emitScenes(socket: SuperSocket) {
  const scenes = await api.getScenes();
  socket.sendToAll('scenes', scenes)
}

io.on('connection', (socket: SuperSocket) => {
  console.log("Client connected")
  // Emit & Broadcast, seems both needed
  socket.sendToAll = function sendToAll(event: string | symbol, ...args: any[]) {
    this.emit(event, ...args)
    this.broadcast.emit(event, ...args)
  }

  emitScenes(socket);

  api.lights().then(ligthsResponse => {
    socket.sendToAll('light-list', ligthsResponse.lights)
    ligthsResponse.lights.forEach(l => {
      socket.sendToAll(`light-status-${l.id}`, l)
    })
  })


  socket.on('go-to-sleep', async (data: { time: number }) => {
    setTimeout(async () => {
      const ligthsResponse = await api.lights();

      ligthsResponse.lights.forEach(l => {
        if (l.id) {
          api.setLightState(l.id, lightState.create().turnOff())
        }
        // socket.sendToAll(`light-status-${l.id}`, l)
      })

    }, data.time)
  })

  socket.on('light-toggle', async (data: { id: string }) => {
    const { id } = data;
    const l = await api.getLightStatus(id)

    if (l.state.on) {
      await api.setLightState(id, lightState.create().turnOff())
    } else {
      await api.setLightState(id, lightState.create().turnOn())
    }

    api.lights().then(ligthsResponse => {
      ligthsResponse.lights
        .filter(x => x.id === id)
        .forEach(l => {
          socket.sendToAll(`light-status-${l.id}`, l)
        })
    })
  });

});


app.get('/api/lights', (_, res) => {
  api.lights().then(ligthsResponse => {
    res.json(ligthsResponse.lights)
  })
})

server.listen(3001, () => console.log('Home automation server running at 3001'))


