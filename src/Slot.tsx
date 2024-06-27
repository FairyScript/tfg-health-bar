import { css } from '@emotion/react'
import { Button, Center, Flex } from '@mantine/core'
import { useMutable } from 'helux'
import SlotCounter from 'react-slot-counter'
import { mainPeer } from './msg/mainPeer'
import { store } from './store'
mainPeer()

const Slot: React.FC = () => {
  const [state] = store.useState()
  const [answer, setAnswer] = useMutable({
    answers: new Array(state.slot.count).fill(0) as number[],
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
                <SlotCounter value={item} />
              </div>
            ))}
          </Flex>
          <Button
            w={200}
            onClick={() =>
              setAnswer((d) => {
                d.answers = new Array(state.slot.count)
                  .fill(0)
                  .map((_, i) =>
                    state.slot.godMode && state.slot.answers[i]
                      ? state.slot.answers[i]
                      : Math.floor(
                          Math.random() *
                            (state.slot.range.max - state.slot.range.min + 1),
                        ) + state.slot.range.min,
                  )
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
