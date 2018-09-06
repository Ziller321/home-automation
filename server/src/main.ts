import dotenv from 'dotenv';
import { HueApi } from "node-hue-api"
import express from 'express';
import http from 'http'
import socketio from 'socket.io'
// import sqlite3 from 'sqlite3';
import { Commands } from './commands';
import { emitLightStatus } from './emitLightStatus';

// const db = new sqlite3.Database('home.db');

// db.serialize(function () {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//     stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//     console.log(row.id + ": " + row.info);
//   });
// });

// db.close();



dotenv.config();

const app = express();
const server = new http.Server(app)

const io = socketio(server);

const host = process.env.host || ""
const user = process.env.user || ""
const api = new HueApi(host, user);


const config = { api, socket: io }

const runTest = () => {
  const testCommands = new Commands(config)
    .fromJson(
      {
        ligths: [
          {
            id: '2',
            commands: [
              { turnOn: true },
              { setColor: { r: 255, g: 255, b: 255 } },
              { setBrightness: 70 },
              { sleep: 1000 },
              {
                repeat: 5, commands: [
                  { turnOff: true },
                  { sleep: 2000 },
                  { turnOn: true }
                ]
              },
              { setColor: { r: 255, g: 0, b: 255 } },
              { sleep: 1000 },
              { turnOff: true },
            ]
          }
        ]
      }
    )

  testCommands.run()

}

const runCommands = () => async (commands: Commands) => {
  new Commands({ api, socket: io }).fromJson(commands).run();
}

io.on('connection', (socket: socketio.Socket) => {
  console.log("Client connected")

  emitLightStatus(api, io);

  socket.on('runCommands', runCommands())
  socket.on('runTest', runTest)

});




server.listen(3001, () => console.log('Home automation server running at 3001'))


// just because
export default {}