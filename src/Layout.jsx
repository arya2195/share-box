import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './pages/Header'
import Footer from './pages/Footer'
function Layout() {
  return (
    <div>
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}

export default Layout