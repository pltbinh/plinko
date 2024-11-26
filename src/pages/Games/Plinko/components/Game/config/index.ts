import { colors } from 'styles/colors'
import { LinesType } from '../@types'
const pins = {
  startPins: 3,
  pinSize: 2,
  pinGap: 20
}

const ball = {
  ballSize: 5.7
}

const engine = {
  engineGravity: 1.0
}

const world = {
  width: 390,
  height: 390
}

const lines: LinesType = 16

export const config = {
  pins,
  ball,
  engine,
  world,
  colors,
  lines
}
