import SlotCounter from 'react-slot-counter'

const Slot: React.FC = () => {
  return (
    <div>
      <SlotCounter value={123456} />
      <SlotCounter value={36.5} />
      <SlotCounter value="1,234,567" />
      <SlotCounter value={['1', '2', '3', '4', '5', '6']} />
      <SlotCounter value="??????" />
    </div>
  )
}

export default Slot
