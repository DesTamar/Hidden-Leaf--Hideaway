import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-orange-600 border-b border-black-500">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        <div
          className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          {/* <!-- Logo --> */}
          <Link className="flex flex-shrink-0 items-center mr-4" href="/index.html">
          <Link
                href="/index.html"
              >
            <img
              className="h-10 w-auto"
              src="image"
              alt="some logo"
            />
              </Link>
            <span className="hidden md:block text-white text-2xl font-bold ml-2"
            >Hidden leaf hideaway</span
            >
          </Link>
          <div className="md:ml-auto">
            <div className="flex space-x-2">
              
              <Link
                to="/login"
                className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
              >login</Link>
              <Link
                href="/add-job.html"
                className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
              >signup</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar