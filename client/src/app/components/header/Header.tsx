'use client'
import Link from 'next/link'
import { useAppSelector } from '../../../redux/hook'
import { useGetUsersQuery } from '../../../redux/services/userApi'

const Header = () => {
  const { loading } = useAppSelector(state => state.auth)
  const { data: user } = useGetUsersQuery()
  console.log(user)

  return (
    <div className=" text-orange-600 py-2 font-bold flex flex-row justify-between items-center">
      <div>
        {loading ? <span>Loading...</span> : ''}
        <Link href="/">
          FARM Cars
          {user ? (
            <span className="mx-2 text-gray-500">
              {user.email} ({user.role})
            </span>
          ) : (
            ''
          )}
        </Link>
      </div>
      <ul className="flex flex-row space-x-4 ">
        <li>
          <Link href="/cars">Cars</Link>
        </li>
        {user && user.role === 'ADMIN' ? (
          <li>
            <Link href="/dashboard">dashboard</Link>
          </li>
        ) : (
          ''
        )}

        {!user ? (
          <>
            <li>
              <Link href="/account/register">Register</Link>
            </li>
            <li>
              <Link href="/account/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/account/logout">Log out {user.username}</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
export default Header
