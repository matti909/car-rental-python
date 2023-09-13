import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <nav className=" text-orange-600 p-2 font-bold flex flex-row justify-between items-center">
      <div>
        <Link href="/">FARM Cars</Link>
      </div>
      <ul className="flex flex-row space-x-4 ">
        <li>
          <Link href="/cars">Cars</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/account/register">Register</Link>
        </li>
        <li>
          <Link href="/account/login">Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header
