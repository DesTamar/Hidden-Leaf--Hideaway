import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpot } from "../../store/spots"
import { Link, useParams } from "react-router-dom"
import { fetchSpotReviews } from "../../store/reviews"
import Review from "../Reviews/Review"
import CreateReview from "../Reviews/CreateReview"
import OpenModalButton from "../OpenModalButton/OpenModalButton"


const SpotDetails = () => {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const user = useSelector(state => state?.session?.user)
  const spot = useSelector(state => state?.spots[0])
  const spotReviews = useSelector(state => state?.spotReviews?.spotReviews)
  const hasReviewed = spotReviews?.some(review => review.userId === user?.id)
  const isOwner = spot?.Owner?.firstName == user?.firstName
  
  useEffect(() => {
    dispatch(getSpot(spotId))
      .then(dispatch(fetchSpotReviews(spotId)))
      .then(() => { setIsLoaded(true) })
  }, [dispatch, spotId])
  return (
    <>
      {
        isLoaded ?
          <div className="spot-details">
            <div className="spot-header">
              <h1>{spot?.name}</h1>
              <p>{spot?.city}, {spot?.state}</p>
            </div>
            {spot?.SpotImages?.length > 0 ?
              (<div className="main-image">
                <img src={spot.SpotImages[0]} />
                <div className="additional-images">
                  {spot.SpotImages.map((image, i) => (
                    <img key={i} src={image} />
                  ))}
                </div>
              </div>
              ) :
              (
                ''
              )
            }
            <div className="spot-info">
              <h2>Hosted by {spot?.Owner?.firstName}{' '}{spot?.Owner?.lastName}</h2>
              <div className="spot description">
                <p>{spot.description}</p>
              </div>
              <div className="reserve-container">
                <div className="spot-details-footer">
                  <p>Price: ${spot?.price} per night</p>
                  <p>Rating: {spot?.avgStarRating}{' '}stars #reviews: {spot?.numReviews}</p>
                </div>
                <button className="reserve=button">reserve</button>
              </div>
            </div>

            <hr />
            <div className="spot-reviews-info">
              <h3>star here:{spot?.avgStarRating} #Reviews {spot?.numReviews}</h3>
              {user && !hasReviewed && !isOwner ? (
                <OpenModalButton
                  buttonText='Post a Review'
                  modalComponent={<CreateReview spotId={spotId}/>}
                />
              ) :
                ('')}
              {spotReviews?.length ?
                (<div className="spot-reviews-info">
                  {spotReviews?.map((review, i) => (
                    <Review key={i} review={review} user={user}/>
                  ))}
                </div>) :
                (
                  ''
                )
              }
            </div>
            <div>
            </div>
          </div>
          :
          <h1>Loading...</h1>
      }
    </>
  )
}

export default SpotDetails