import { lazy } from 'react'
import { Navigate, createHashRouter } from 'react-router-dom'

const MainPage = lazy(() => import('../MainPage'))
const Control = lazy(() => import('../Control'))

export const mainRoute = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/ctl',
    element: <Control />,
  },

  {
    path: '*',
    element: <Navigate to="/" />,
  },
])
