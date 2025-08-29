import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import App from './App.jsx'
import Authcontextprovider from '../context/Authcontextprovider.jsx'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const router=createBrowserRouter([
  {path:'/',
    elment:<Layout></Layout>,
    children:[
      {
      path:'',
      element:<Home></Home>
      }
    ]

  },
  {
    path:'/login',
    element:<Login></Login>
  },
  {
    path:'/signup',
    element:<Signup></Signup>
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Authcontextprovider>
    <RouterProvider router={router}></RouterProvider>
 </Authcontextprovider>
 <ToastContainer></ToastContainer>
  </StrictMode>,
)
