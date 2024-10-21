import { useState } from "react";
import { useDispatch } from "react-redux";
import { postReview } from "../../store/reviews";

const CreateReview = ({spotId}) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    review: '',
    stars: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(
      {
        ...formData,
        [name]: value
      }
    )

  }
  const handleSubmit = (e) => {
    e.preventDefault();
  
    //dispatch post review thunk
    dispatch(postReview(spotId,formData))
    
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>How was your stay?</h1>
          <label htmlFor="review">Leave a review</label>
          <textarea
            id='review'
            name='review'
            value={formData.review}
            placeholder="Leave your review here..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="rating">Stars</label>
          <select
            id="stars"
            name='stars'
            value={formData.stars}
            onChange={handleChange}
          >
            <option value='1'>1 stars</option>
            <option value='2'>2 stars</option>
            <option value='3'>3 stars</option>
            <option value='4'>4 stars</option>
            <option value='5'>5 stars</option>
          </select>
        </div>
        <button type="submit" disabled={formData.review.length < 10}>Submit your Review</button>
      </form>
    </>

  )
}

export default CreateReview