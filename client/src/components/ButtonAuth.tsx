'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function ButtonAuth() {
  const { data: session, status } = useSession()

  console.log({ session, status })

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (session !== null) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button
          onClick={async () => {
            await signOut()
          }}
          className="bg-gray-200"
        >
          Sign out
        </button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button
        onClick={async () => {
          await signIn()
        }}
        className="py-4 px-4 bg-slate-100 text-black rounded-[6px] hover:bg-gray-600"
      >
        Sign in
      </button>
    </>
  )
}
