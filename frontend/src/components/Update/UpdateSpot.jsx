import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { getSpot } from "../../store/spots"
import CreateSpot from "../CreateSpot/CreateSpot"

const UpdateSpot = () => {
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots[0])
    useEffect(() => {
        dispatch(getSpot(spotId))
    },[dispatch,spotId])
    if (!spot){
        return <h1>Loading...</h1>
    }
  return (
   <CreateSpot
   initialData={spot}
   title='Upadte your Spot'
   buttonText='Update'
   spotId={spotId}
   />
  )
}

export default UpdateSpot