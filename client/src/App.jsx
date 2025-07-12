import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Outlet, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  // If the current route is an admin route, do not render Navbar and Footer
  if (isAdminRoute) {
    return (
      <>
        <Toaster />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
