import React from 'react'
import SpotListing from './SpotListing'
import {useState,useEffect} from 'react'
//some how import spots from backend???
//fake spots array
const spots = [{
    id:1,
    name: "spotname1",
    description: "spot description ...1",
    price: 1000,
    location: "lon/lat"

},
{
    id:2,
    name: "spotname2",
    description: "spot description ...2",
    price: 20000,
    location: "lon/lat"

},
{
    id:3,
    name: "spotname3",
    description: "spot description ...3",
    price: 3000,
    location: "lon/lat"

}
]

const Spottile = () => {
    const [Spots,setSpots] = useState([])
    useEffect(() => {
        const fetchSpots = async () => {
            const res = await fetch('htt')
        }
    },[])
    return (
        <>
         <section className="bg-blue-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Browse Spots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spots.map((spot) => (
                <SpotListing key={spot.id}spot={spot}/>
            ))}   
          </div>
        </div>
      </section>
    </>
  )
}

export default Spottile