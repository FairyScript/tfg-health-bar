export interface IMessage {
  type: IMessageType
  data?: IUpdateMessage
}

export type IMessageType = 'sync' | 'update' | 'reset' | 'hi'

export type IUpdateMessage = {
  total: number
  current: number
  log: IIog[]
}

export type IIog = {
  name: string
  value: number
  id: number
}
