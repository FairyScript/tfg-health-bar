import {
  Button,
  Container,
  Fieldset,
  Flex,
  NumberInput,
  Popover,
  Slider,
  Text,
  TextInput,
} from '@mantine/core'
import HealthBar from './components/HealthBar'
import { store } from './store'
import { useEffect } from 'react'
import { connect, send } from './msg/controlPeer'
import { sharex, useWatch } from 'helux'
import { IMessage } from './@types/message'

const formStore = sharex({
  name: '',
  value: '0',
  deleteOpen: false,
})

const Control: React.FC = () => {
  const [state, setState] = store.useState()
  useEffect(() => {
    document.title = '控制端'
  }, [])

  useWatch(
    () => {
      const data: IMessage = {
        type: 'update',
        data: state.health,
      }
      console.log(data)

      send(data)
    },
    () => [state.health]
  )

  const [form] = formStore.useState()

  const onSubmit = () => {
    setState((d) => {
      const value = parseInt(form.value)
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
    <Container>
      <div>{state.ui.isConnected ? '已连接' : '未连接'}</div>
      <Slider
        color="blue"
        min={0}
        max={state.health.total}
        onChange={(v) =>
          setState((d) => {
            d.health.current = v
          })
        }
        value={state.health.current}
        marks={[
          { value: 20, label: '20%' },
          { value: 50, label: '50%' },
          { value: 80, label: '80%' },
        ]}
        mb='lg'
      />
      <HealthBar />

      <Button
        onClick={() => {
          connect()
        }}
        disabled={!state.ui.ready || state.ui.isConnected}
      >
        连接
      </Button>
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
      </Fieldset>
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
    </Container>
  )
}

export default Control
