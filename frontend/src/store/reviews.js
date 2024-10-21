import { csrfFetch } from "./csrf"



const GET_REVIEWS = 'GET_REVIEWS'
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS'
const POST_REVIEW = 'POST_REVIEW'

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


//thunks 
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)
    const data = await res.json()
    dispatch(getSpotReviews(data))
}
export const postReview = (spotId,review) => async dispatch => {
    
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
        method:'POST',
        body:JSON.stringify(review)
    })
    const data = await res.json()
    dispatch(addReview(data))
    return data
}


//reducer
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            return { ...state, spotReviews: action.spotReviews }
        case POST_REVIEW:
            return { ...state, review: action.review }
        default: return state
    }
}
export default reviewsReducer
