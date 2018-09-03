import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { IScene } from "node-hue-api";
import * as React from "react";
import { Socket } from './Socket'

export class Scenes extends React.Component<{}, {}>{
  public toggleScene = () => {
    console.log("toggle")
  }
  public render() {
    return (
      <Socket event="scenes">
        {
          (scenes: IScene[]) => {
            console.log("scene", scenes)
            return (
              <div>{scenes.map(scene => (
                <Card onClick={() => this.toggleScene()}>
                  <CardContent>
                    <Typography color="textSecondary">
                      {scene.name}
                    </Typography>


                  </CardContent>
                </Card>
              ))}</div>
            )
          }
        }
      </Socket>
    )
  }
}