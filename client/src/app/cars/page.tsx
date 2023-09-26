'use client'
import React from 'react'
import { useGetCarsQuery } from '../../redux/services/car.api'
import Card from '../components/card/Card'

const Cars = () => {
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
            <Card
              key={car._id}
              brand={car.brand}
              make={car.make}
              year={car.year}
              url={car.picture || ''}
              km={car.km}
              price={car.price}
              cm3={car.cm3}
              id={car._id}
            />
          ))}
        </div>
      ) : null}
    </main>
  )
}

export default Cars
