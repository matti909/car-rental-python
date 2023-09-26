import { buildUrl } from 'cloudinary-build-url'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CardProps {
  _id: string
  brand: string
  make: string
  year: number
  url: string
  km: number
  price: number
  cm3?: number
}

const transformedUrl = (id: string) =>
  buildUrl(id, {
    cloud: {
      cloudName: 'dqxd8euqj',
    },
    transformations: {
      effect: {
        name: 'grayscale',
      },
      effect: {
        name: 'tint',
        value: '60:blue:white',
      },
    },
  })

const Card: React.FC<CardProps> = ({
  brand,
  make,
  year,
  url,
  km,
  price,
  cm3,
  _id,
}) => {
  return (
    <Link href={'cars/' + _id}>
      <div className="flex flex-col max-w-sm rounded overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200">
        <div className=" w-full h-48">
          <Image
            src={transformedUrl(url)}
            alt={brand}
            height={250}
            width={600}
            objectFit="cover"
          />
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">
            {brand} {make}
          </div>
          <p className="text-orange-600 font-bold">Price: {price} EUR</p>
          <p className="text-gray-700 text-base">
            A detailed car description from the Cars FARM crew.
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            made in {year}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Cm3: {cm3 || 'N/A'}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Km: {km}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Card
