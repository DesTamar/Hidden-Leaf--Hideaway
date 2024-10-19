import { Link } from 'react-router-dom'
import './Spot.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchSpotReviews } from '../../store/reviews'

const SpotTile = ({ id, previewImage, city, state,rating }) => {
  const dispatch = useDispatch()
  const review = useSelector(state => state.spotReviews.spotReviews)
  
  useEffect(() => {
    dispatch(fetchSpotReviews(id))
  },[dispatch])
  return (
    <Link to={`/${id}`}>
      <div className='spot-tile'>
        <img src={previewImage} alt="spot Image" />
        <div className='spot-info'>
          <p>{city} , {state}, {rating}</p>
        </div>
        <div className='review-info'>
          <p></p>
        </div>
      </div>
    </Link>
  )
}

export default SpotTile