import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createSpot } from "../../store/spots"
import {useNavigate} from 'react-router-dom'


const CreateSpot = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        // Owner:user,
       
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        lat: '',
        lng: '',
        name: '',
        price: '',

    })
    const handleChange = (e) => {
        const newSpot = useSelector(state => state.spot)
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        //dispatch post form data thunk here!!!
       const res = await dispatch(createSpot(formData))
       if (res){
           console.log()
        //    navigate(`/${newSpot[0].id}`)

       }
  
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Create a New Spot</h1>
                <h2>Wheres your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div>
                            <label>Country</label>
                            <input
                                type='text'
                                id='country'
                                name='country'
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <label>Street Adress</label>
                            <input
                                type='text'
                                id='street-address'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <label>City</label>
                            <input
                                type='text'
                                id='city'
                                name='city'
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <label>State</label>
                            <input
                                type='text'
                                id='state'
                                name='state'
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <label>Lat</label>
                            <input
                                type='number'
                                id='lat'
                                name='lat'
                                value={formData.lat}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <label>Lng</label>
                            <input
                                type='number'
                                id='lng'
                                name='lng'
                                value={formData.lng}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="form-group">
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <textarea
                            type='text'
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please write at least 30 characters"
                        />
                    </div>
                    <hr />
                    <div className="form-group">
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        <input
                            type="text"
                            id='name'
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name of your spot"
                        />
                    </div>
                </form>
                <hr />
                <div className="form-group">
                    <h2>Set a base Price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input
                        type="number"
                        id='price'
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price per night (USD)"
                    />
                </div>
                <hr />
                <div className="form-group">
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least  one photo to publish your spot</p>

                    <input
                        type='text'
                        id="url"
                        name='url'
                    />
                    {/* {not done yet} */}
                </div>
            </div>
            <button type="submit">Create Spot</button>
        </form>
    )
}

export default CreateSpot