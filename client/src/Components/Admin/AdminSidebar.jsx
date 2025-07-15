import { LayoutDashboard, List, PlusSquare, Split } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'

const AdminSidebar = () => {
  return (
    <div className='max-w-8 md:max-w-60 w-full flex flex-col py-6 h-screen border-r border-gray-100/20'>
      <NavLink end to="/admin" className={({ isActive }) => `flex  items-center gap-2 py-2 px-2 md:px-6 w-full ${isActive ? 'bg-primary/40 text-accent border-r-4 border-accent' : ''}`}><LayoutDashboard /> <span className='hidden md:inline-block'>DashBoard</span></NavLink>
      <NavLink to="/admin/add-shows" className={({ isActive }) => `flex  items-center gap-2 py-2 px-2 md:px-6 w-full ${isActive ? 'bg-primary/40 text-accent border-r-4 border-accent' : ''}`}><PlusSquare /> <span className='hidden md:inline-block'>Add Shows</span></NavLink>
      <NavLink to="/admin/list-shows" className={({ isActive }) => `flex  items-center gap-2 py-2 px-2 md:px-6 w-full ${isActive ? 'bg-primary/40 text-accent border-r-4 border-accent' : ''}`}><List /> <span className='hidden md:inline-block'>List Shows</span></NavLink>
      <NavLink to="/admin/list-bookings" className={({ isActive }) => `flex  items-center gap-2 py-2 px-2 md:px-6 w-full ${isActive ? 'bg-primary/40 text-accent border-r-4 border-accent' : ''}`}><Split /> <span className='hidden md:inline-block'>List Bookings</span></NavLink>
    </div>
  )
}

export default AdminSidebar
