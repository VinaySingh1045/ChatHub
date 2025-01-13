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
import Profile from './components/UserProfile/Profile'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

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
      {
        path: "/profile",
        element: <Profile />
      },
    ]

  }
])
const persist = persistStore(store)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist} >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>
)
