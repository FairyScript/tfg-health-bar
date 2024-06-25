import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex, List, ListItem } from '@mantine/core'
import { useEffect } from 'react'
import HealthBar from './components/HealthBar'
import { mainPeer } from './msg/mainPeer'
import { resumeStore, store } from './store'

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
    <Flex
      direction="column"
      align="center"
      gap="md"
      css={css`
        padding: 0 20px;
        background-image: url('/arianne-elliott-ghroth-11.jpg');
        background-size: cover;
        height: 100vh;
      `}
    >
      <Flex
        css={css`
          align-self: flex-start;
        `}
      >
        <CurrentHealth>当前生命值: {state.health.current}</CurrentHealth>
      </Flex>
      <Flex gap="md" w="100%">
        <div
          css={css`
            flex: 1;
          `}
        >
          <HealthBar />
        </div>
        <CurrentHealth>
          {((state.health.current * 100) / state.health.total).toFixed(0)}%
        </CurrentHealth>
      </Flex>
      <List icon={null}>
        {state.health.log.map((item) => (
          <ListItem key={item.id} css={style}>
            队伍 <PartyName>{item.name}</PartyName> 造成了{' '}
            <DamageValue>{item.value}</DamageValue>
            点伤害
          </ListItem>
        ))}
      </List>
    </Flex>
  )
}

export default MainPage

const CurrentHealth = styled.span`
  color: orange;
  font-size: 20px;
  font-weight: bold;
`

const PartyName = styled.span`
  color: orange;
`

const DamageValue = styled.span`
  color: red;
`

const style = css`
  list-style-type: none;
`
