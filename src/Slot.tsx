import { css } from '@emotion/react'
import { Button, Center, Flex } from '@mantine/core'
import { useMutable, useOnEvent } from 'helux'
import SlotCounter from 'react-slot-counter'
import { mainPeer } from './msg/mainPeer'
import { store } from './store'
mainPeer()

// 已经抽中的人
const alreadySet = new Set<number>(
  JSON.parse(localStorage.getItem('alreadySet') || '[]'),
)
function setAlreadySet(num: number) {
  alreadySet.add(num)
  localStorage.setItem('alreadySet', JSON.stringify(Array.from(alreadySet)))
}
function clearAlreadySet() {
  alreadySet.clear()
  localStorage.setItem('alreadySet', '[]')
}

function generateRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const Slot: React.FC = () => {
  const [state] = store.useState()
  const [answer, setAnswer] = useMutable({
    answers: new Array(state.slot.count).fill(0) as number[],
  })

  useOnEvent('clearSlot', () => {
    clearAlreadySet()
  })

  return (
    <div
      css={css`
      height: 100vh;
      background-color: aliceblue;
    `}
    >
      <Center
        css={css`
      .text{
        font-size: 50px;
        font-weight: bold;
        color: #333;
        padding: 0 5px;
      }
  `}
      >
        <Flex direction="column" align="center">
          <Flex>
            {answer.answers.map((item, index) => (
              <div
                key={index}
                className="text"
                css={css`
                border: solid 1px #333;
                margin: 20px;
              `}
              >
                <SlotCounter value={String(item).padStart(5, '0')} />
              </div>
            ))}
          </Flex>
          <Button
            w={200}
            onClick={() =>
              setAnswer((d) => {
                d.answers = new Array(state.slot.count).fill(0).map((_, i) => {
                  const godMode = state.slot.godMode && state.slot.answers[i]
                  if (godMode) return state.slot.answers[i]

                  let c = 0
                  let num = generateRandom(
                    state.slot.range.min,
                    state.slot.range.max,
                  )
                  while (alreadySet.has(num)) {
                    c++
                    if (c > 100) {
                      return -1
                    }
                    if (alreadySet.size === state.slot.count) {
                      return -1
                    }
                    num = generateRandom(
                      state.slot.range.min,
                      state.slot.range.max,
                    )
                  }
                  setAlreadySet(num)
                  return num
                })
              })
            }
            color="orange"
          >
            抽奖!
          </Button>
        </Flex>
      </Center>
    </div>
  )
}

export default Slot
