import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchUserSpots } from "../../store/spots"
import SpotTile from "../SpotTiles/SpotTile"
import { Link } from "react-router-dom"

const ManageSpotsFormModal = () => {
    const dispatch = useDispatch()
     const userSpots = useSelector(state => Object.values(state.spots))
    

    useEffect(()=> {
        dispatch(fetchUserSpots())
    },[dispatch])
     
  return (
    <div>
        <h1>Manage Your Spots</h1>
        {userSpots?.length > 0 ? (
            <ul>
                
                {userSpots.map((spot) => (
                    <SpotTile
                    key={spot.id}
                    id={spot.id}
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