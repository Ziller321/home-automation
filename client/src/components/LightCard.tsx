import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { ILight } from "node-hue-api";
import * as React from "react"
import { ColorResult, SliderPicker } from 'react-color';
import { Socket } from './Socket'


interface IProps {
  light: ILight
}

export class LightCard extends React.Component<IProps, {}> {


  public toggleLight = async () => {
    const { light } = this.props
    const commands = {
      ligths: [{
        actions: ['toggle'],
        id: light.id,
      }]
    };
    window.io.emit(`runCommands`, {
      commands
    })
  }

  public setColor = (color: ColorResult) => {
    const { light } = this.props
    const commands = {
      ligths: [
        {
          actions: [{ action: 'setColor', value: { r: color.rgb.r, g: color.rgb.g, b: color.rgb.b } }],
          id: light.id,

        }
      ]
    };
    window.io.emit(`runCommands`, {
      commands
    })
  }

  public render() {
    const { light } = this.props
    return (
      <Socket event={`light-status-${this.props.light.id}`}>
        {
          (data: ILight) => (
            <Card>
              <CardContent>
                <Typography color="textSecondary">
                  {light.name}
                </Typography>

                <Switch
                  onChange={this.toggleLight}
                  checked={data.state.on}
                />

                <SliderPicker onChangeComplete={this.setColor} />

              </CardContent>
            </Card>
          )
        }
      </Socket>

    )
  }
}