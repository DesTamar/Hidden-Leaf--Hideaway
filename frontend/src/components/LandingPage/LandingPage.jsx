import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpots } from "../../store/spots"
import SpotTile from "../SpotTiles/SpotTile"
import '../SpotTiles/Spot.css'

const LandingPage = () => {
  const dispatch = useDispatch()
  const spots = useSelector((state) => state.spots.spots || [])

  
   useEffect(() => {
    dispatch(getSpots())
   },[dispatch])
  return (
    
    <div className="landing-page">
      <h1>Hideaway Spots</h1>
      <div className="spots-container">
        {spots.map((spot) =>(
          <SpotTile
          key={spot.id}
          id={spot.id}
          previewImage={spot.previewImage}
          city={spot.city}
          state={spot.state}
          rating={spot.avgRating}
          />
        ))}
      </div>
    </div>
  )
}

export default LandingPage