import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

const MainPage = lazy(() => import('../MainPage'))
const Control = lazy(() => import('../Control'))
const Slot = lazy(() => import('../Slot'))
export const mainRoute = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/day2',
    element: <MainPage />,
  },
  {
    path: '/ctl',
    element: <Control />,
  },
  {
    path: '/slot',
    element: <Slot />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
])
