import { emit } from 'helux'
import Peer from 'peerjs'
import type { IMessage, ISlotMessage, IUpdateMessage } from '../@types/message'
import { store } from '../store'

let flag = false

export function mainPeer() {
  if (flag) {
    return
  }
  const peer = new Peer('6f5705df-ecd3-42d5-a941-3c45c68a8082')
  peer.on('open', (id) => {
    console.log(`Ready. My peer ID is: ${id}`)
  })
  peer.on('connection', (conn) => {
    conn.on('open', () => {
      conn.send({
        type: 'hi',
      })
      store.setDraft((d) => {
        d.ui.isConnected = true
      })
    })

    conn.on('data', (data) => {
      const msg = data as IMessage
      console.log(msg)
      switch (msg.type) {
        case 'sync': {
          conn.send({
            type: 'update',
            data: store.getSnap(false).health,
          })
          break
        }
        case 'update': {
          if (msg.data) {
            store.setDraft((d) => {
              d.health = msg.data as IUpdateMessage
            })
          }
          break
        }
        case 'slot': {
          store.setDraft((d) => {
            d.slot = msg.data as ISlotMessage
          })
          break
        }
        case 'clearSlot': {
          emit('clearSlot')
        }
      }
    })
  })

  flag = true

  return peer
}
