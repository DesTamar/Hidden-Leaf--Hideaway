import OpenModalButton from "../OpenModalButton/OpenModalButton"
import DeleteSpot from "../Spots/DeleteSpot"


const Review = ({ review, user, onDelete }) => {
  const isuser = user?.firstName === review.User?.firstName
  const creation = review.createdAt
  const dateObj = new Date(creation)
  const month = dateObj.getMonth() + 1
  const year = dateObj.getFullYear();



 
  return (
    <div>
      <h3>{review.User.firstName}</h3>
      <p>{month}/{year}</p>
      <p>{review.review}</p>
      {isuser ? (
      
        <OpenModalButton
          buttonText='delete'
          modalComponent=
          {<DeleteSpot
            reviewId={review.id}
            onDelete={onDelete}
            deleteType='review'
          />}
        />
      ) : (
        ''
      )
      }
    </div>
  )
}

export default Review