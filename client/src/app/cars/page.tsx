'use client'
import React from 'react'
import { useGetCarsQuery } from '../../redux/services/carsApi'

const cars = () => {
  const { data, isLoading, error, isFetching } = useGetCarsQuery(null)

  if (isLoading) return <div>Cargando...</div>

  return (
    <main>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : isLoading || isFetching ? (
        <p>Loading...</p>
      ) : data ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 20,
          }}
        >
          {data?.map(car => (
            <div key={car._id}>
              <h3>{car.brand}</h3>
              <p>make: {car.make}</p>
              <p>Price: {car.price}</p>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  )
}

export default cars
