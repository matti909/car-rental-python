'use client'
import React from 'react'
import { useSession } from 'next-auth/react'

const dashboard = () => {
  const { data: session, status } = useSession()
  console.log(status, session)
  return <div>dashboard</div>
}

export default dashboard
