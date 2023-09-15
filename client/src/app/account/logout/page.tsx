'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch } from '../../../redux/hook'
import { logout } from '../../../redux/slices/authSlice'

const Logout = () => {
  const dispatch = useAppDispatch()
  const removeCookie = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const router = useRouter()
  useEffect(() => {
    void removeCookie()
    dispatch(logout())
    router.push('/account/login')
  }, [])

  return <></>
}

export default Logout
