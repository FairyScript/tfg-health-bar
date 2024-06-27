import {
  Button,
  Checkbox,
  Container,
  Fieldset,
  Flex,
  NumberInput,
  Popover,
  Text,
  TextInput,
} from '@mantine/core'
import { sharex, useMutable, useWatch } from 'helux'
import { useEffect } from 'react'
import type { IMessage } from './@types/message'
import HealthBar from './components/HealthBar'
import { connect, send } from './msg/controlPeer'
import { store } from './store'

const formStore = sharex({
  name: '',
  value: '0',
  deleteOpen: false,
})

const Control: React.FC = () => {
  useEffect(() => {
    document.title = '控制端'
  }, [])

  return (
    <Container>
      <Connection />
      <HealthCtl />
      <SlotCtl />
    </Container>
  )
}

export default Control

const SlotCtl: React.FC = () => {
  const [state, setState] = store.useState()

  useWatch(
    () => {
      const data: IMessage = {
        type: 'slot',
        data: state.slot,
      }
      send(data)
    },
    () => [state.slot],
  )
  return (
    <div>
      <Fieldset legend="抽奖">
        <NumberInput
          label="抽奖数量"
          mt="md"
          value={state.slot.count}
          onChange={store.sync((to) => to.slot.count)}
        />
        <NumberInput
          label="最小值"
          mt="md"
          value={state.slot.range.min}
          onChange={store.sync((to) => to.slot.range.min)}
        />
        <NumberInput
          label="最大值"
          mt="md"
          value={state.slot.range.max}
          onChange={store.sync((to) => to.slot.range.max)}
        />
        <Checkbox
          label="U God?"
          checked={state.slot.godMode}
          onChange={store.sync((to) => to.slot.godMode)}
        />
        {state.slot.godMode && (
          <Flex gap={8}>
            <span>答案</span>
            {new Array(state.slot.count).fill(0).map((_, i) => (
              <NumberInput
                key={i}
                value={state.slot.answers[i]}
                onChange={(v) => {
                  setState((d) => {
                    d.slot.answers[i] = Number(v)
                  })
                }}
              />
            ))}
          </Flex>
        )}
      </Fieldset>
    </div>
  )
}

const Connection: React.FC = () => {
  const [state] = store.useState()

  return (
    <div>
      <div>{state.ui.isConnected ? '已连接' : '未连接'}</div>

      <Button
        onClick={() => {
          connect()
        }}
        disabled={!state.ui.ready || state.ui.isConnected}
      >
        连接
      </Button>
    </div>
  )
}

const HealthCtl: React.FC = () => {
  const [state, setState] = store.useState()
  const [form] = formStore.useState()
  const [h, setH] = useMutable({
    subV: 0,
    setV: 0,
  })
  useWatch(
    () => {
      const data: IMessage = {
        type: 'update',
        data: state.health,
      }
      send(data)
    },
    () => [state.health],
  )

  const onSubmit = () => {
    setState((d) => {
      const value = Number.parseInt(form.value)
      const newV = Math.max(0, d.health.current - value)
      d.health.current = newV
      d.health.log.push({
        name: form.name,
        value,
        id: Date.now(),
      })
    })
  }

  return (
    <div>
      <HealthBar />

      <Fieldset legend="修改数值">
        <NumberInput
          label="最大生命值"
          mt="md"
          value={state.health.total}
          onChange={store.sync((to) => to.health.total)}
        />
        <Flex align="flex-end" gap={16}>
          <NumberInput
            label="血量(减)"
            mt="md"
            value={h.subV}
            onChange={(v) => {
              setH((d) => {
                d.subV = Number(v)
              })
            }}
          />
          <Button
            onClick={() => {
              setState((d) => {
                d.health.current -= h.subV
              })
            }}
          >
            提交
          </Button>
        </Flex>
        <Flex align="flex-end" gap={16}>
          <NumberInput
            label="血量设置"
            mt="md"
            value={h.setV}
            onChange={(v) => {
              setH((d) => {
                d.setV = Number(v)
              })
            }}
          />
          <Button
            onClick={() => {
              setState((d) => {
                d.health.current = h.setV
              })
            }}
          >
            提交
          </Button>
        </Flex>
      </Fieldset>
      <Fieldset legend="新增条目">
        <TextInput
          label="name"
          placeholder="名字"
          value={form.name}
          onChange={formStore.syncer.name}
        />
        <NumberInput
          label="value"
          placeholder="血量(减)"
          mt="md"
          min={0}
          max={state.health.current}
          value={form.value}
          onChange={formStore.syncer.value}
        />
        <Flex gap="md">
          <Button onClick={onSubmit}>提交</Button>
          <Popover
            width={200}
            position="bottom"
            withArrow
            shadow="md"
            opened={form.deleteOpen}
          >
            <Popover.Target>
              <Button
                color="red"
                onClick={() => {
                  formStore.setState({ deleteOpen: true })
                }}
              >
                清空
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">确定要删除吗 </Text>
              <Flex gap="md">
                <Button
                  color="red"
                  onClick={() => {
                    setState((d) => {
                      d.health.current = d.health.total
                      d.health.log = []
                    })
                    formStore.setState({ deleteOpen: false })
                  }}
                >
                  删除
                </Button>
                <Button
                  variant="light"
                  onClick={() => {
                    formStore.setState({ deleteOpen: false })
                  }}
                >
                  取消
                </Button>
              </Flex>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Fieldset>
    </div>
  )
}
