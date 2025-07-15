import React from 'react'
import AdminNavbar from '../../Components/Admin/AdminNavbar'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <AdminNavbar />
      <div className='flex flex-1 overflow-hidden'>
        <AdminSidebar />
        <div className='flex-1 p-4 px-6 overflow-y-auto scrollbar-none'>
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
