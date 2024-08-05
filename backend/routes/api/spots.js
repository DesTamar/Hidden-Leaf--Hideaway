const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth,validDates, spotAuth, isOwner, revExist,isValidReview, isValid, isValidImage } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');






//get spots
router.get('/', async (req, res) => {

  let spots = await Spot.findAll({
    include: [{
      attributes: ['url'],
      model: SpotImage,
      where: {
        preview: true
      }
    },
    {
      model: Review,
      attributes: ['stars']
    },
    ]
  });


  const ratedSpots = spots.map(spot => {
    spot = spot.toJSON()
    const sum =
      spot.Reviews.reduce((acc, review) => (
        acc += review.stars
      ), 0);
    spot.avgRating = sum / spot.Reviews.length
    delete spot['Reviews']
    spot.previewImage = spot.SpotImages[0].url
    delete spot['SpotImages']
    return spot
  })



 return res.json(ratedSpots)
})



//get all spots of current user
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
    include: [{
      attributes: ['stars'],
      model: Review
    },
    {
      model: SpotImage,
      where: {
        preview: true
      }
    }],
  })


  const ratedSpots = spots.map(spot => {
    spot = spot.toJSON()
    const sum =
      spot.Reviews.reduce((acc, review) => (
        acc += review.stars
      ), 0);
    spot.avgRating = sum / spot.Reviews.length
    delete spot['Reviews']
    spot.previewImage = spot.SpotImages[0].url
    delete spot['SpotImages']
    return spot
  })

 return res.json(ratedSpots)
})

router.get('/:spotId', spotAuth, async (req, res) => {
  const { spotId } = req.params

  let spots = await Spot.findAll({
    where: {
      id: spotId
    },
    include: [{
      attributes: ['id', 'url', 'preview'],
      model: SpotImage
    },
    {
      model: Review,
      attributes: ['stars']
    },
    {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }
    ]
  });


  const ratedSpots = spots.map(spot => {
    spot = spot.toJSON()
    const sum =
      spot.Reviews.reduce((acc, review) => (
        acc += review.stars
      ), 0);
    spot.numReviews = spot.Reviews.length
    spot.avgStarRating = sum / spot.Reviews.length
    delete spot['Reviews']
    spot.Owner = spot.User
    delete spot["User"]
    return spot
  })



 return res.json(ratedSpots)
})




//post spot
router.post('/', requireAuth, isValid, async (req, res, next) => {
const {user} = req
  const newSpot = await Spot.create({
    ...req.body,
    ownerId: user.id
  })
  res.status(201).json(newSpot)
})



router.post('/:spotId/images', requireAuth, spotAuth, isOwner, async (req, res, next) => {

  const { spotId } = req.params

  const newImage = await SpotImage.create({
    ...req.body,
    spotId
  })
  
 return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  })

})




//edit a spotd
router.put('/:spotId', requireAuth, spotAuth, isOwner, isValid, async (req, res) => {

  const { user } = req
  const id = req.params.spotId

  const edit = await Spot.findOne({
    where: {
      id
    }
  })
  await edit.update({
    ...req.body,
    ownerId: user.id
  })
  return res.json(edit)




})

//delete a spot given spoId
router.delete('/:spotId', requireAuth, spotAuth, isOwner, async (req, res, next) => {

  const { spotId } = req.params


  const deleted = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  await deleted.destroy()
  return res.json({
    message: `Successfully removed spot ${spotId}`,
  });



})




router.post('/:spotId/reviews', requireAuth, spotAuth,revExist, isValidReview, async (req, res, next) => {
  const {user} = req
  const {spotId} = req.params
  const newReview = await Review.create({
    ...req.body,
    spotId: Number(spotId),
    userId: user.id
  })

 return res.status(201).json(newReview)

})


router.get('/:spotId/reviews', spotAuth, async (req, res, next) => {
  const { spotId } = req.params
  let reviews = await Review.findAll({
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    where: {
      spotId
    },
    include: [{
      attributes: ['id', 'firstName', 'lastName'],
      model: User
    }, {
      attributes: ['id', 'url'],
      model: ReviewImage
    }]
  })
 return  res.json(reviews)
})


// {body
//   "startDate": "2021-11-19",
//   "endDate": "2021-11-20"
// }
router.post('/:spotId/bookings', requireAuth, spotAuth,validDates, async (req, res, next) => {
  const { spotId } = req.params
  const { user } = req
  let {startDate,endDate} = req.body
  const spot = await Spot.findOne({
    where: {
      id: spotId
    },
    include: [{
      model: Booking
    }]
  })

  if (user.id === spot.ownerId) {
    const err = new Error()
    err.message = "Spot must NOT belong to current user"
    err.status = 403
    return next(err)
  }
 

  const bookings = spot.Bookings
const err = new Error()
err.errors = {}
  for (const booking of bookings){
   
   if (startDate >= booking.startDate && startDate <= booking.endDate){
      err.errors.startDate = "Start date conflicts with exiting booking"
    }
    if (endDate >= booking.startDate && endDate <= booking.endDate){
      err.errors.endDate = "End date conflicts with existing booking"
    }
    if (startDate < booking.startDate && endDate > booking.endDate){
      err.errors.dates = "Booking cannot extend before and after existing booking"
    }
    if (Object.keys(err.errors).length){
      err.status = 403
      return next(err)
    }
  }

    
  const newBooking = await Booking.create({
    ...req.body,
    userId: user.id,
    spotId
  })
  return res.status(201).json(newBooking)
})



router.get('/:spotId/bookings', requireAuth, spotAuth, async (req, res, next) => {
  const { user } = req
  const { spotId } = req.params
  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  if (user.id !== spot.ownerId) {
    const booking = await Booking.findAll({
      attributes: ['spotId', 'startDate', 'endDate'],
      where: {
        spotId
      }
    })
    return res.json(booking)
  } else {
    const booking = await Booking.findAll({
     
      where: {
        spotId
      },
      include: [{
        attributes: ['id', 'firstName', 'lastName'],
        model: User
      }]
    })
    return res.json(booking)
  }
})



module.exports = router