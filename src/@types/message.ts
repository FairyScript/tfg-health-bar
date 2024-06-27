export interface IMessage {
  type: IMessageType
  data?: IUpdateMessage | ISlotMessage
}

export type IMessageType =
  | 'sync'
  | 'update'
  | 'reset'
  | 'hi'
  | 'slot'
  | 'clearSlot'

export type IUpdateMessage = {
  total: number
  current: number
  log: IIog[]
}

export type ISlotMessage = {
  count: number
  godMode: boolean
  range: {
    min: number
    max: number
  }
  answers: number[]
}

export type IIog = {
  name: string
  value: number
  type: 'heal' | 'damage' | 'save' | 'jam'
  id: number
}
