import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpot, getSpot } from "../../store/spots"
import { Link, useParams } from "react-router-dom"
import { fetchSpotReviews } from "../../store/reviews"
import Review from "../Reviews/Review"
import CreateReview from "../Reviews/CreateReview"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import { MdStarRate } from 'react-icons/md'
import { LuDot } from 'react-icons/lu'
import './SpotDetails.css'
const SpotDetails = () => {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const user = useSelector(state => state?.session?.user)
  const spot = useSelector(state => state?.spots[0])
  const spotReviews = useSelector(state => state?.spotReviews?.spotReviews || [])
  const isOwner = spot?.Owner?.firstName == user?.firstName
  const [reviews, setReviews] = useState([])



  let grammar;
  if (spot?.numReviews === 1) {
    grammar = 'Review'
  } else {
    grammar = 'Reviews'
  }

  const sortedSpots = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))


  useEffect(() => {
    dispatch(getSpot(spotId))
      .then(dispatch(fetchSpotReviews(spotId)))
      .then(() => { setIsLoaded(true) })
  }, [dispatch, spotId])

  useEffect(() => {
    if (spotReviews) {
      setReviews(spotReviews)
    }
  }, [spotReviews])

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews?.filter((review) => review.id !== reviewId))
  }

  const prevImage = spot?.SpotImages?.find(img => img.preview === true)
  const additonalImages = spot?.SpotImages?.filter(image => image.preview === false)

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

              (
                <div className="image-container">
                  <div className="main-image">

                    <img src={prevImage.url} />
                    <div className="additional-images">
                    </div>
                    {additonalImages.map((spot, i) => (
                      <img key={i} src={spot.url} />
                    ))}
                  </div>
                </div>
              ) :
              (
                ''
              )
            }
            <div className="spot-info-container">
              <div className="spot-info">
                <h2>Hosted by {spot?.Owner?.firstName}{' '}{spot?.Owner?.lastName}</h2>
                <p className="description">{spot?.description}</p>
              </div>
              <div className="price-box">
                <div className="price-rating">
                  <p className="price">Price: ${spot?.price} per night</p>
                  {
                    spot?.numReviews ? (
                      <p className="rating"><MdStarRate /> {spot?.avgStarRating.toFixed(2)} <LuDot /> #{grammar}: {spot?.numReviews}</p>
                    ) :
                      (
                        <p className="rating"><MdStarRate /> New</p>
                      )
                  }
                </div>
                <button className="reserve-button">Reserve</button>
              </div>
            </div>

            <hr />
            <div className="spot-reviews-info">
              {
                spot?.numReviews ? (
                  <h3><MdStarRate />  {spot?.avgStarRating.toFixed(2)} <LuDot /> #{grammar}: {spot?.numReviews}</h3>
                ) :
                  (
                    <p><MdStarRate /> New</p>
                  )
              }

              {user && !(spotReviews?.some(review => review.userId === user?.id)) && !isOwner ? (
                <OpenModalButton
                  buttonText='Post a Review'
                  modalComponent={<CreateReview spotId={spotId} />}
                />
              ) :
                ('')}
              {spotReviews?.length ?
                (<div className="spot-reviews-info">
                  {sortedSpots.map((review) => (
                    <Review key={review.id} review={review} user={user} onDelete={handleDeleteReview} />
                  ))}
                </div>) :
                (
                  'Be the first to review!'
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