import Grid from '@material-ui/core/Grid';
import { ILight } from "node-hue-api";
import * as React from 'react';
import { LightCard } from './LightCard';
import { Socket } from './Socket'

export const Lights: React.SFC<{}> = () => (
  <Socket event="light-list">
    {(lights: ILight[]) => (
      <Grid container={true} spacing={24}>
        {
          lights.map(l => (
            <Grid item={true} xs={4}>
              <LightCard key={l.id || ""} light={l} />
            </Grid>
          ))
        }
      </Grid>
    )}
  </Socket>
)