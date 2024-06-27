import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { mainRoute } from './router/mainRoute.tsx'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import './index.css'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <RouterProvider router={mainRoute} />
  </MantineProvider>,
)
