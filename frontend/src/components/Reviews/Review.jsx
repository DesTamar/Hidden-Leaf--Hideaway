

const Review = ({review}) => {
 
  return (
    <div>
      <h3>{review.User.firstName}</h3>
      <p>{review.review}</p>
    </div>
  )
}

export default Review