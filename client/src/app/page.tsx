'use client'

import { useAppSelector } from '../redux/hook'

const home = () => {
  const isAuth = useAppSelector(state => state.auth)
  console.log(isAuth)
  return (
    <div>
      <h1>Car Rental</h1>
    </div>
  )
}

export default home
