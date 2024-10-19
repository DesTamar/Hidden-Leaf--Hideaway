import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'GET_ALL_SPOTS'
const GET_SPOT = 'GET_SPOT'
const CREATE_SPOT = 'CREATE_SPOT'
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



//thunks 
export const getSpots = () => async (dispatch) => {
    try {
        const res = await fetch('/api/spots')
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
export const createSpot = (spot) => async dispatch =>{
    const res = await csrfFetch(`/api/spots`,{
        method: 'POST',
        // headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    if (res.ok){
        const data = await res.json()
        dispatch(postSpot(data))
        return spot
    }
}


//reducer
const initialState = {}

const spotActions = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, spots: action.spots }
        case GET_SPOT:
            return { ...state, ...action.spot }
        case CREATE_SPOT:
            return {...state, ...action.spot}    
        default: return state
    }
}


export default spotActions