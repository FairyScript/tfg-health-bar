import { sharex, watch } from 'helux'
import { IIog } from './@types/message'

export const store = sharex({
  ui: {
    isConnected: false,
    ready: false,
  },
  health: {
    total: 100,
    current: 100,
    log: [] as IIog[],
  },
})

watch(
  () => {
    localStorage.setItem('store', JSON.stringify(store.getSnap(false).health))
  },
  { deps: () => [store.state.health] }
)

export function resumeStore() {
  const data = localStorage.getItem('store')
  if (data) {
    store.setState((d) => {
      d.health = JSON.parse(data)
    })
  }
}
