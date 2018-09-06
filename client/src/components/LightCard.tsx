import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { Commands } from "api/main"
import { ILight } from "node-hue-api";
import * as React from "react"
import { RGBColor, ColorResult, SliderPicker } from 'react-color';
import { Socket } from './Socket'


interface IProps {
    light: ILight
}

interface IState {
    color?: RGBColor
}

export class LightCard extends React.Component<IProps, IState> {

    public state = {
        color: undefined
    }

    public toggleLight = async () => {
        const { light } = this.props

        const commands: Commands = {
            ligths: [{
                commands: [{ toggle: true }],
                id: String(light.id),
            }]
        };
        window.io.emit(`runCommands`, {
            commands
        })
    }

    public setColor = (color: ColorResult) => {
        const { light } = this.props
        const { r, g, b } = color.rgb;
        const commands = {
            ligths: [
                {
                    commands: [{ setColor: { r, g, b } }],
                    id: light.id,

                }
            ]
        };

        this.setState({
            color: color.rgb
        })
        window.io.emit(`runCommands`, {
            commands
        })
    }

    public render() {
        const { light } = this.props
        const { color } = this.state
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

                                <SliderPicker color={color} onChangeComplete={this.setColor} />

                            </CardContent>
                        </Card>
                    )
                }
            </Socket>

        )
    }
}