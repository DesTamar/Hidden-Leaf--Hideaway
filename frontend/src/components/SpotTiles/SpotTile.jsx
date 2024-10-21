import { Link, NavLink } from 'react-router-dom'
import './Spot.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchSpotReviews } from '../../store/reviews'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import DeleteSpot from '../Spots/DeleteSpot'

const SpotTile = ({ id, previewImage, city, state, rating, showManageButtons }) => {
  const dispatch = useDispatch()
  const review = useSelector(state => state.spotReviews.spotReviews)

  useEffect(() => {
    dispatch(fetchSpotReviews(id))
  }, [dispatch])
  return (
    <Link to={`/${id}`}>
      <div className='spot-tile'>
        <img src={previewImage} alt="spot Image" />
        <div className='spot-info'>
          <p>{city} , {state}, {rating}</p>
        </div>
        {showManageButtons && (
          <div className='button'>
            <NavLink to={`/update-spot/${id}`}>
              <button className='button'>Update</button>
            </NavLink>
            <OpenModalButton
            onButtonClick={(e) => e.stopPropagation()}
              buttonText='delete'
              modalComponent={<DeleteSpot />}
            />
          </div>
        )}
        <div className='review-info'>
          <p></p>
        </div>
      </div>
    </Link>
  )
}

export default SpotTile