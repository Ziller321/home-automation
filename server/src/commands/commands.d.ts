import { SetColor } from "./setColor";
import { Sleep } from "./sleep";
import { SetBrightness } from "./setBrightness";
import { TurnOn } from "./turnOn";
import { TurnOff } from "./turnOff";
import { Repeat } from "./repeat";
import { Toggle } from "./toggle";

type Command =
  | Repeat
  | SetColor
  | Sleep
  | SetBrightness
  | TurnOn
  | TurnOff
  | Toggle
