import { useState } from "react"
import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"
import { fetchDeleteSpot } from "../../store/spots"
import { fetchDeleteReview,fetchSpotReviews } from "../../store/reviews"
const DeleteSpot = ({ deleteType,spotId,reviewId,onDelete,onDeleteSpot }) => {
  const dispatch = useDispatch()
const {closeModal} = useModal()
const [errors,setErrors] = useState({})




const handleDeleteReview =  (e) => {
  e.preventDefault()
  dispatch(fetchDeleteReview(reviewId,spotId))
  .then(() => {onDelete(reviewId)})
  .then(()=> closeModal())
}

  const handleDeleteSpot = (e) => {
    e.preventDefault()
     dispatch(fetchDeleteSpot(spotId))
     .then(() => {onDeleteSpot(spotId)})
     .then(closeModal)
  }

let pageType;
if (deleteType){
  pageType = deleteType
} else {
  pageType = 'Spot'
}


  return (
    <div className="modal">

      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this {pageType}?</p>

      {deleteType ? (
        
        <button style={{ backgroundColor: 'red'}} onClick={handleDeleteReview}>{`Yes (Delete ${pageType})` }</button>
      ):(
        <button style={{ backgroundColor: 'red'}} onClick={handleDeleteSpot}>{`Yes (Delete ${pageType})` }</button>
      )
    }
      <button style={{backgroundColor: "darkgray"}} onClick={closeModal}>{`No (Keep ${pageType})`}</button>
    
    </div>
  )
}

export default DeleteSpot