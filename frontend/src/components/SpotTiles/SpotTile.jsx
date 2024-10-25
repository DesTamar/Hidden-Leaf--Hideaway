import { Link, NavLink } from 'react-router-dom'
import './Spot.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchSpotReviews } from '../../store/reviews'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import DeleteSpot from '../Spots/DeleteSpot'
import { MdStarRate } from 'react-icons/md'

const SpotTile = ({ id, previewImage, city, state, rating, showManageButtons ,price, onDeleteSpot,spot}) => {
  const dispatch = useDispatch()
  const review = useSelector(state => state.spotReviews.spotReviews)

  useEffect(() => {
    dispatch(fetchSpotReviews(id))
  }, [dispatch])
  return (
    <div className='spot-tile' title={spot.name}>
        <Link to={`/${id}`}>
        <img src={previewImage} alt="spot Image" />
        <div className='spot-info'>
          <p className='location'>{city} , {state}, </p>
          <p className='rating'><MdStarRate/>{rating}</p>
        </div>
        <div>
          <p>{price} /night</p>
        </div>
        </Link>
        {showManageButtons && (
          <div className='button'>
            <NavLink to={`/update-spot/${id}`}>
              <button className='button'>Update</button>
            </NavLink>
            <OpenModalButton
              buttonText='delete'
              modalComponent={<DeleteSpot 
                onDeleteSpot={onDeleteSpot}
                spotId={id}
              />}
            />
          </div>
        )}
        <div className='review-info'>
          <p></p>
        </div>
      </div>
  )
}

export default SpotTile