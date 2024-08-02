const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth, isOwner } = require('../../utils/auth')
const {handleValidationErrors } = require('../../utils/validation')


router.get('/:spotId',handleValidationErrors, async (req, res,next) => {
  const { spotId } = req.params
  
  let spots = await Spot.findAll({
    where: {
      id: spotId
    },
    include: [{ 
      attributes: ['id','url','preview'],
      model: SpotImage },
    {
      model: User,
      attributes: ['id', 'firstName', 'lastName'],
    },
    {
      attributes: ['stars'],
      model: Review
    }
  ],
  })

  const ratedSpots = spots.map(spot => {
    spot = spot.toJSON()
    const sum =
    spot.Reviews.reduce((acc, review) => (
      acc += review.stars
    ), 0);
    spot.avgStarRating =  sum / spot.Reviews.length
    spot.numReviews = spot.Reviews.length
    delete spot['Reviews']
    return spot
  })


  res.json(ratedSpots)
})





module.exports = router