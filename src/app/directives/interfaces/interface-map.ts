export type Position = {
  longitude: number, latitude: number, altitude: number
}

export type Route = {
  id: number,
  start: Position,
  end: Position | undefined,
}