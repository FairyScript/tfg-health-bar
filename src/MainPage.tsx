import { useEffect } from 'react'
import HealthBar from './components/HealthBar'
import { resumeStore, store } from './store'
import { mainPeer } from './msg/mainPeer'
import { List, ListItem } from '@mantine/core'
import { css } from '@emotion/react'

mainPeer()
const MainPage: React.FC = () => {
  useEffect(() => {
    document.title = '进度条'
  }, [])
  useEffect(() => {
    resumeStore()
  }, [])

  const [state] = store.useState()
  return (
    <div>
      <HealthBar />
      <h2>当前值: {state.health.current}</h2>
      <h2>总值: {state.health.total}</h2>
      <List icon={null}>
        {state.health.log.map((item) => (
          <ListItem key={item.id} css={style}>
            队伍 <span className="name">{item.name}</span> 造成了{' '}
            <span className="value">{item.value}</span>
            点伤害
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default MainPage

const style = css`
  .name {
    color: orange;
  }
  .value {
    color: red;
  }
`
