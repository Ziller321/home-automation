import { HueApi } from "node-hue-api";
import socketio from 'socket.io'

export async function emitLightStatus(api: HueApi, io: socketio.Server) {
  api.lights().then(ligthsResponse => {
    io.emit('light-list', ligthsResponse.lights)
    ligthsResponse.lights.forEach(l => {
      io.emit(`light-status-${l.id}`, l)
    })
  })
}