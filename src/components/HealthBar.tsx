import { store } from '@/store'
import { css } from '@emotion/react'

const HealthBar: React.FC = () => {
  const [state] = store.useState()

  const persent = (state.health.current / state.health.total) * 100

  const style = {
    width: `${Math.max(persent, 0)}%`,
  }

  const redStyle = {
    width: `${Math.abs(persent)}%`,
  }
  return (
    <div css={healthBar}>
      <div style={redStyle} className="health-bar red" />
      <div style={style} className="health-bar blue" />
      <div style={style} className="health-bar green" />
    </div>
  )
}

export default HealthBar

const healthBar = css`
  background-color: #ccc;
  height: 30px;
  width: 100%;
  margin: 0 auto;
  border: solid 1px #aaa;
  position: relative;

  .health-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
  .green {
    background-color: #007f00;
    transition: width 1s;
  }
  .red {
    background-color: #cc0000;
    transition: width 1.5s;
  }
  .blue {
    background-color: #3bd3df;
    transition: width 0.5s;
  }
`
