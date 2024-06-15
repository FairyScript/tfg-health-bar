import Peer, { DataConnection } from 'peerjs'
import { store } from '../store'
import { IMessage } from '../@types/message'

let conn: DataConnection

const peer = new Peer('dde91806-5604-453f-a770-bd62685bbac5')
peer.on('open', function (id) {
  console.log('My peer ID is: ' + id)
  store.setDraft((d) => {
    d.ui.ready = true
  })
})
peer.on('disconnected', () => {
  console.log('disconnected')
  store.setDraft((d) => {
    d.ui.isConnected = false
  })
})
peer.on('close', () => {
  console.log('close')
  store.setDraft((d) => {
    d.ui.isConnected = false
  })
})

export function connect() {
  if (conn) {
    conn.close()
  }
  conn = peer.connect('6f5705df-ecd3-42d5-a941-3c45c68a8082')
  conn.on('open', () => {
    conn.send({
      type: 'hi',
    })
    conn.send({
      type: 'sync',
    })
  })
  conn.on('close', () => {
    store.setDraft((d) => {
      d.ui.isConnected = false
    })
  })

  conn.on('data', (data) => {
    const msg = data as IMessage
    console.log(msg)
    switch (msg.type) {
      case 'hi': {
        store.setDraft((d) => {
          d.ui.isConnected = true
        })
        break
      }
      case 'update': {
        if (msg.data) {
          store.setDraft((d) => {
            d.health = msg.data!
          })
        }
        break
      }
    }
  })
}

export function send(msg: IMessage) {
  if (conn) {
    conn.send(msg)
  }
}
