import Button from '@material-ui/core/Button';
import { ILight } from 'node-hue-api';
import * as React from 'react';
import * as io from 'socket.io-client';
// import { Scenes } from './components/Scenes'
import styled from 'styled-components'
import { Lights } from './components/Lights';
import { Menu } from './components/Menu';

const AppWrapper = styled.div`
  background: #333;
  min-height: 100vh;

  display: flex;
`;

const Content = styled.div`
  padding: 20px;
`

interface IState {
  lights: ILight[]
}

declare global {
  interface Window { io: SocketIOClient.Socket; }
}

window.io = io();

class App extends React.Component<{}, IState> {

  public goToSleep = () => {
    window.io.emit('go-to-sleep', { time: 5000 })
  }

  public render() {
    return (
      <AppWrapper>
        <Menu />

        <Content>
          <Button variant="contained" color="primary" onClick={this.goToSleep}>Nukkumaan</Button>
          {/* <Scenes /> */}
          <Lights />
        </Content>

      </AppWrapper>
    );
  }
}

export default App;
