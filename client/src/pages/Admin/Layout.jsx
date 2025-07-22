import AdminNavbar from '../../Components/Admin/AdminNavbar'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import { Outlet } from 'react-router'
import { useAppContext } from '../../Context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import { useEffect } from 'react'
import Loader from '../../Components/Loader'

const Layout = () => {
  const { user, isAdmin, fetchIsAdmin } = useAppContext()

  if (!user.isSignedIn || !user.user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <SignIn />
      </div>
    )
  }
  useEffect(() => {
    const checkAdmin = async () => {
      await fetchIsAdmin()
    }
    checkAdmin()
  }, [fetchIsAdmin])
  return isAdmin ? (
    <div className='flex flex-col h-screen overflow-hidden'>
      <AdminNavbar />
      <div className='flex flex-1 overflow-hidden'>
        <AdminSidebar />
        <div className='flex-1 p-4 px-6 overflow-y-auto scrollbar-none'>
            <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default Layout
