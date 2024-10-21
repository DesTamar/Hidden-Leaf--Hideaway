import OpenModalButton from "../OpenModalButton/OpenModalButton"
import DeleteSpot from "../Spots/DeleteSpot"


const Review = ({review , user}) => {
 const isuser = user?.firstName === review.User?.firstName
 console.log(isuser)
  return (
    <div>
      <h3>{review.User.firstName}</h3>
      <p>{review.review}</p>
      {isuser ? (
        // <div>delete</div>
        <OpenModalButton
        buttonText='delete'
        modalComponent=
        {<DeleteSpot
         deleteType='review'
        />}
        />
      ):(
        ''
      )
    }
    </div>
  )
}

export default Review