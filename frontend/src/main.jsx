import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Upload from './pages/Upload.jsx'
import ShareFile from './pages/ShareFile.jsx'
import Authcontextprovider from '../context/Authcontextprovider.jsx'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import OpenSharedFile from './pages/OpenSharedFile.jsx'
const router=createBrowserRouter([
  {path:'/',
    element:<Layout></Layout>,
    children:[
      { path:'/', element:<Home></Home> },
      { path:'/upload', element:<Upload></Upload> },
      {path:'/share/:fileId',element:<ShareFile></ShareFile>}
    ]
  },
  { path:'/login', element:<Login></Login> },
  { path:'/signup', element:<Signup></Signup> },
{path:'/shared/:shareId',element:<OpenSharedFile></OpenSharedFile>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Authcontextprovider>
    <RouterProvider router={router}></RouterProvider>
 </Authcontextprovider>
 <ToastContainer></ToastContainer>
  </StrictMode>,
)
