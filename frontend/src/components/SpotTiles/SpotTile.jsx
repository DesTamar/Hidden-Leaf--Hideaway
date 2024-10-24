import { Link, NavLink } from 'react-router-dom'
import './Spot.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSpotReviews } from '../../store/reviews'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import DeleteSpot from '../Spots/DeleteSpot'
import{ MdStarRate} from 'react-icons/md'
const SpotTile = ({ spot,id, previewImage, city, state, rating,price, showManageButtons, onDeleteClick,onDeleteSpot }) => {
  const dispatch = useDispatch()
  const review = useSelector(state => state.spotReviews.spotReviews)




const handleDeleteClick = (e) => {
  e.preventDefault()
  onDeleteClick(id)
}




  useEffect(() => {
    dispatch(fetchSpotReviews(id))
  }, [dispatch])
  return (
    <div className='spot-tile' title={spot.name} >
        <Link to={`/${id}`}>
        <img className='spot-image' src={previewImage} alt="spot Image" />
        <div className='spot-info'>
          <div className='location'>
          <p>{city} , {state}</p>
          <p>{price} night</p>
          </div>
          <div className='rating'>
            {rating ? (
              <p><MdStarRate/> {rating?.toFixed(2)}</p> 
            ):
            (
              <p><MdStarRate/> New</p> 
            )
          }
          </div>
        </div>
        </Link>
        {showManageButtons && (
          <div className='button'>
            <NavLink to={`/update-spot/${id}`}>
              <button className='button'>Update</button>
            </NavLink>
            <OpenModalButton
            buttonText='delete'
            modalComponent={<DeleteSpot spotId={id} onDeleteSpot={onDeleteSpot} />}
            />
          </div>
        )}
      </div>
  )
}

export default SpotTile