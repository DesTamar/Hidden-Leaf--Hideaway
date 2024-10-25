import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { createSpot, postSpotImage, updateSpot } from "../../store/spots"
import { useNavigate } from 'react-router-dom'
import './CreateSpot.css'

const CreateSpot = ({ initialData, title, buttonText, spotId }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        lat: '',
        lng: '',
        name: '',
        price: '',
        prevImg: '',
        img1: '',
        img2: '',
        img3: '',
        img4: ''
    })



    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])


    const handleChange = (e) => {

        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        if (spotId) {
            await dispatch(updateSpot({ ...formData, id: spotId }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
            navigate(`/${spotId}`)
        } else {
             await dispatch(createSpot(formData))
                .then((spot) => {
                    const spotId = spot.dataValues.id
                    
                    dispatch(postSpotImage({ spotId, url: formData.prevImg, preview: true }))


                    const optionalImages = [formData.img1, formData.img2, formData.img3, formData.img4]
                    optionalImages.forEach((img) => {
                        if (img) {
                            dispatch(postSpotImage({ spotId, url: img, preview: false }))
                        }
                    })
                    navigate(`/${spot.dataValues.id}`)
                })
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
                
        }

    }


    return (
        <form className="creation-form" onSubmit={handleSubmit}>
            <div >
                {!title ? (
                    <h1>Create a New Spot</h1>
                ) : (
                    <h1>{title}</h1>
                )
                }
                <h2>Wheres your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <form onSubmit={handleSubmit}>
                    <div className=''>
                        <input
                            type='text'
                            id='country'
                            name='country'
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.country && <p>{errors.country}</p>}
                    <div className="form-group">
                        <label>Street Adress</label>
                        <input
                            type='text'
                            id='street-address'
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.address && <p>{errors.address}</p>}
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type='text'
                            id='city'
                            name='city'
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.city && <p>{errors.city}</p>}
                    <div className="form-group">
                        <label>State</label>
                        <input
                            type='text'
                            id='state'
                            name='state'
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.state && <p>{errors.state}</p>}
                    <div className="form-group">
                        <label>Lat</label>
                        <input
                            type='number'
                            id='lat'
                            name='lat'
                            value={formData.lat}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.lat && <p>{errors.lat}</p>}
                    <div className="form-group">
                        <label>Lng</label>
                        <input
                            type='number'
                            id='lng'
                            name='lng'
                            value={formData.lng}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.lng && <p>{errors.lng}</p>}
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
                    {errors.description && <p>{errors.description}</p>}
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
                    {errors.name && <p>{errors.name}</p>}
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
                {errors.price && <p>{errors.price}</p>}
                <hr />
                <div className="form-group">
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least  one photo to publish your spot</p>
                    <div className="image-input">

                        <div>
                            <input
                                placeholder=" Preview Image Url"
                                type='text'
                                id="prevImg"
                                name='prevImg'
                                value={formData.prevImg}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.prevImg && <p>{errors.prevImg}</p>}
                        <input
                            placeholder="Image Url"
                            type='text'
                            id="img1"
                            name='img1'
                            value={formData.img1}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="Image Url"
                            type='text'
                            id="img2"
                            name='img2'
                            value={formData.img2}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="Image Url"
                            type='text'
                            id="img3"
                            name='img3'
                            value={formData.img3}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="Image Url"
                            type='text'
                            id="img4"
                            name='img4'
                            value={formData.img4}
                            onChange={handleChange}
                        />
                    </div>

                </div>
            </div>

            {!buttonText ? (
                <button type="submit">Create Spot</button>
            ) : (
                <button type="submit">{buttonText}</button>
            )
            }

        </form>
    )
}

export default CreateSpot