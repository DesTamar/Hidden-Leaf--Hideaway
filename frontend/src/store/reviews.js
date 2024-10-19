


const GET_REVIEWS = 'GET_REVIEWS'
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS'

//actions
export const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})


export const getSpotReviews = (spotReviews) => ({
    type: GET_SPOT_REVIEWS,
    spotReviews
})


//thunks 
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`api/spots/${spotId}/reviews`)
    const data = await res.json()
    dispatch(getSpotReviews(data))
}


//reducer
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            return { ...state, spotReviews: action.spotReviews }
        default: return state
    }
}
export default reviewsReducer
