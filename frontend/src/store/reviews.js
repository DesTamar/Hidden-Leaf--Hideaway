import { csrfFetch } from "./csrf"
import { getSpot } from "./spots"



const GET_REVIEWS = 'GET_REVIEWS'
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS'
const POST_REVIEW = 'POST_REVIEW'
const DELETE_REVIEW = 'DELETE_REVIEW'
//actions
export const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})


export const getSpotReviews = (spotReviews) => ({
    type: GET_SPOT_REVIEWS,
    spotReviews
})
export const addReview = (review) => ({
    type: POST_REVIEW,
    review
})
export const removeReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})


//thunks 
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)
    const data = await res.json()
    dispatch(getSpotReviews(data))
}
export const postReview = (spotId,newReview) => async dispatch => {
    const {review,stars} = newReview
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
        method:'POST',
        body:JSON.stringify({review,stars})
    })

    if (res.ok){

        const data = await res.json()
        dispatch(addReview(data))
        dispatch(getSpotReviews(spotId))
        dispatch(getSpot(spotId))
        return res

    }
}
export const fetchDeleteReview = (reviewId,spotId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`,{method:'DELETE'})

    if (res.ok) {
        dispatch(removeReview(reviewId))
       
        
        return res
    }
}


//reducer
const initialState = {}
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            return { ...state, spotReviews: action.spotReviews }
        case POST_REVIEW:
            return { ...state, review: action.review }
        case DELETE_REVIEW:
            const deleted = action.reviewId
            const newState = {...state,deleted}
            delete newState.deleted
            return newState
        default: return state
    }
}
export default reviewsReducer
