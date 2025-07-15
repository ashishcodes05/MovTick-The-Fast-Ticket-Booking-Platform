import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router'

const AdminNavbar = () => {
  return (
    <div className='px-6 md:px-16 lg:px-18 py-4 flex items-center justify-between border-b-1 border-gray-300/20'>
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.movTickLogo} alt="" className="w-36 h-auto" />
      </Link>
      <button className='bg-primary hover:scale-102 cursor-pointer px-4 py-2 rounded-md'>Logout</button>
    </div>
  )
}

export default AdminNavbar
