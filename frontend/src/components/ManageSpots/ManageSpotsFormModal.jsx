import { useEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchUserSpots, getSpots } from "../../store/spots"
import SpotTile from "../SpotTiles/SpotTile"
import { Link } from "react-router-dom"

const ManageSpotsFormModal = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.session.user.id)
    const userSpots = [useSelector(state => state.spots.spots?.find(spot => spot.ownerId === userId) || [])]
    const [currUserSpots,setCurrUserSpots] = useState([])
   
    useEffect(()=> {
        dispatch(fetchUserSpots())
        dispatch(getSpots())
    },[dispatch],userId)

    useEffect(() => {
        if (userSpots) {
            setCurrUserSpots(userSpots)
        }
    },[])
console.log(currUserSpots)

    const handleDeleteSpot = spotId => {
        setCurrUserSpots(currUserSpots.filter((currUserSpot) => currUserSpot.id !== spotId))
    }
     
  return (
    <div>
        <h1>Manage Your Spots</h1>
        {userSpots.length > 0 ? (
            <ul>
                
                {currUserSpots.map((spot) => (
                    <SpotTile
                    key={spot.id}
                    id={spot.id}
                    onDeleteSpot={handleDeleteSpot}
                    previewImage={spot.previewImage}
                    city={spot.city}
                    state={spot.state}
                    rating={spot.avgRating}
                    showManageButtons={true}
                    />
                ))}
            </ul>
        ) : (
            <Link to='/create-spot'>
                Create a New Spot
            </Link>
        )}
    </div>
  )
}

export default ManageSpotsFormModal