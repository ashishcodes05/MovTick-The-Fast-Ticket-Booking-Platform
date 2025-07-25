import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

const Loader = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      navigate('/' + nextUrl);
    }
  }, [nextUrl]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  )
}

export default Loader
