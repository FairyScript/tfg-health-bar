import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex, List, ListItem } from '@mantine/core'
import { useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import type { IIog } from './@types/message'
import HealthBar from './components/HealthBar'
import { mainPeer } from './msg/mainPeer'
import { resumeStore, store } from './store'

const MainPage: React.FC = () => {
  useEffect(() => {
    document.title = '进度条'
  }, [])
  useEffect(() => {
    mainPeer()
    resumeStore()
  }, [])

  const isDay2 = Boolean(useMatch('/day2'))

  const [state] = store.useState()
  return (
    <Flex
      direction="column"
      align="center"
      gap="md"
      css={css`
        padding: 0 20px;
        height: 100vh;
        position: relative;
        overflow: hidden;
      `}
    >
      <div
        css={css`
          background-image: url('/arianne-elliott-ghroth-11.jpg');
          background-size: cover;
          position: absolute;
          left: -10%;
          top: -10%;
          width: 120%;
          height: 120%;
          z-index: -1;
          filter: blur(5px);
      `}
      />
      <Flex
        css={css`
          align-self: flex-start;
        `}
      >
        {isDay2 ? (
          <CurrentHealth>拯救世界的几率: {state.health.current}%</CurrentHealth>
        ) : (
          <CurrentHealth>当前生命值: {state.health.current}</CurrentHealth>
        )}
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
      <List
        icon={null}
        css={css`
          color: white;
          font-size: large;
          display: flex;
          flex-direction: column-reverse;
        `}
      >
        {state.health.log.map((item) => (
          <LogLine key={item.id} logline={item} />
        ))}
      </List>
    </Flex>
  )
}

export default MainPage

const LogLine: React.FC<{ logline: IIog }> = ({ logline }) => {
  switch (logline.type) {
    case 'damage':
      return (
        <ListItem css={style}>
          团队<PartyName>{logline.name}</PartyName>通过碎片对格赫罗斯造成了
          <DamageValue>{logline.value}</DamageValue>
          点伤害！
        </ListItem>
      )
    case 'heal':
      return (
        <ListItem css={style}>
          团队<PartyName>{logline.name}</PartyName>为格赫罗斯恢复了
          <HealValue>{logline.value}</HealValue>
          生命！
        </ListItem>
      )
    case 'save':
      return (
        <ListItem css={style}>
          团队<PartyName>{logline.name}</PartyName>
          完成了壮举！世界获得拯救的概率上升
          <HealValue>{logline.value}</HealValue>
          %！
        </ListItem>
      )
    case 'jam':
      return (
        <ListItem css={style}>
          团队<PartyName>{logline.name}</PartyName>让世界获得拯救的概率下降
          <HealValue>{logline.value}</HealValue>
          %！
        </ListItem>
      )
  }
}

const CurrentHealth = styled.span`
  color: orange;
  font-size: 20px;
  font-weight: bold;
`

const PartyName = styled.span`
  color: orange;
  padding: 0 5px;
`

const DamageValue = styled.span`
  color: red;
  padding: 0 5px;
`
const HealValue = styled.span`
  color: green;
  padding: 0 5px;
`

const style = css`
  list-style-type: none;
`
