import React from 'react'
import { Link } from 'react-router-dom'

const SpotListing = ({spot}) => {
  return (
    <div className="bg-white rounded-xl shadow-md relative">
    <div className="p-4">
      <div className="mb-6">
        
        <h3 className="text-xl font-bold">{spot.name}</h3>
      </div>
      <Link
    to="/"
  >
<img
  className="h-10 w-auto"
  src="image"
  alt="some logo"
/>
  </Link>

      <div className="mb-5">
       {spot.description}
      </div>

      <h3 className="text-blue-500 mb-2">{spot.price}/ Year</h3>

      <div className="border border-gray-100 mb-5"></div>

      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <div className="text-orange-700 mb-3">
          <i className="fa-solid fa-location-dot text-lg"></i>
         {spot.location}
        </div>
        <Link
          to={`/spots/${spot.id}`}
          className="h-[36px] bg-blue-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  </div>
  )
}

export default SpotListing
