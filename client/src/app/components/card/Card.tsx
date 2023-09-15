import React from 'react'

interface DataCard {
  brand: string | undefined
  make: string | undefined
  price: number | undefined
}

const UserCard = (car: DataCard) => {
  return (
    <div className="user-card">
      <h3>{car.brand}</h3>
      <p>make: {car.make}</p>
      <p>Price: {car.price}</p>
    </div>
  )
}
export default UserCard
