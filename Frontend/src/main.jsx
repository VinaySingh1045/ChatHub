import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './app/store.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/login",
        element: <Login />
      },
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    <Toaster />
  </StrictMode>,
)
