import React from 'react'
import { Link } from 'react-router-dom'

const AllSpots = () => {
  return (
  <>
  <section className="m-auto max-w-lg my-10 px-6">
        <Link
          to="/spots"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >View All spots</Link>
      </section>
  </>
  )
}

export default AllSpots