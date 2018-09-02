import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { ILight } from "node-hue-api";
import * as React from "react"
import { Socket } from './Socket'

interface IProps {
  light: ILight
}

export class LightCard extends React.Component<IProps, {}> {


  public toggleLight = async () => {
    const { light } = this.props
    window.io.emit(`light-toggle`, { id: light.id })
  }

  public render() {
    const { light } = this.props
    return (
      <Socket event={`light-status-${this.props.light.id}`}>
        {
          (data: ILight) => (
            <Card onClick={this.toggleLight}>
              <CardContent>
                <Typography color="textSecondary">
                  {light.name}
                </Typography>

                <Switch
                  checked={data.state.on}
                />

              </CardContent>
            </Card>
          )
        }
      </Socket>

    )
  }
}