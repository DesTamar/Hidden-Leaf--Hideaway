import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'GET_ALL_SPOTS'
const GET_SPOT = 'GET_SPOT'
const CREATE_SPOT = 'CREATE_SPOT'
const CURR_USER_SPOTS = 'CURR_USER_SPOTS'
const UPDATE_SPOT = 'UPDATE_SPOT'
//actions
export const fetchSpots = (spots) => (
    {
        type: GET_ALL_SPOTS,
        spots
    }
)
export const fetchSpot = (spot) => ({
    type: GET_SPOT,
    spot
})
export const postSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})
export const getCurrUserSpots = (spots) => ({
    type: CURR_USER_SPOTS,
    spots
})
export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})


//thunks 
export const getSpots = () => async (dispatch) => {
    try {
        const res = await csrfFetch('/api/spots')
        if (res.ok) {
            const data = await res.json()
            dispatch(fetchSpots(data))
            return res
        }

    } catch (error) {
        return error
    }
}

export const getSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
    if (res.ok) {
        const data = await res.json()
        dispatch(fetchSpot(data))
        return data
    }
}
export const createSpot = (spot) => async dispatch => {
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        // headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(postSpot(data))
        return data
    }
}
export const fetchUserSpots = () => async dispatch => {
    const res = await csrfFetch(`/api/spots/current`)


    if (res.ok) {
        const data = await res.json()
        dispatch(getCurrUserSpots(data))
        return res
    }
}
export const updateSpot = (spot) => async dispatch => {
    const {
        country,
        address,
        city,
        state,
        description,
        lat,
        lng,
        name,
        price,
        id

    } = spot
    const res = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            country,
            address,
            city,
            state,
            description,
            lat,
            lng,
            name,
            price
        })
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(editSpot(data))
        return res
    }
}


//reducer
const initialState = {}

const spotActions = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            const newState = { ...state, spots: action.spots }
            return newState
        case GET_SPOT:
            return { ...state, ...action.spot }
        case CREATE_SPOT:
            return { ...state, ...action.spot }
        case CURR_USER_SPOTS:
            return { ...state, ...action.spots }
        case UPDATE_SPOT:
            return { ...state, ...action.spot }
        default: return state
    }
}


export default spotActions