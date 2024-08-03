const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking,ReviewImage } = require('../../db/models');
const { requireAuth, spotAuth, isOwner, isValidReview,isValid,isValidImage} = require('../../utils/auth')
const {handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');






//get spots
router.get('/', async (req, res) => {
  
  let spots = await Spot.findAll({
    include: [{
      attributes: ['url'],
      model: SpotImage ,
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
    spot.avgRating =  sum / spot.Reviews.length
    delete spot['Reviews']
    spot.previewImage = spot.SpotImages[0].url
    delete spot['SpotImages']
    return spot
  })



  res.json(ratedSpots)
})

router.get('/:spotId', async (req, res) => {
  const {spotId} = req.params
  
  let spots = await Spot.findAll({
    where: {
      id: spotId
    },
    include: [{
      attributes: ['id','url','preview'],
      model: SpotImage 
    },
    {
      model: Review,
      attributes: ['stars']
    },
    {
      model: User,
      attributes: ['id','firstName','lastName']
    }
  ]
  });
  
  
  const ratedSpots = spots.map(spot => {
    spot = spot.toJSON()
    const sum =
    spot.Reviews.reduce((acc, review) => (
      acc += review.stars
    ), 0);
    spot.avgRating =  sum / spot.Reviews.length
    delete spot['Reviews']
    spot.Owner = spot.User
    delete spot["User"]
    return spot
  })



  res.json(ratedSpots)
})



//get all spots of current user
router.get('/current',requireAuth, async (req, res) => {
  const { user } = req
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
    include: [{ 
      attributes: ['stars'],
      model: Review },
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
    spot.avgRating =  sum / spot.Reviews.length
    delete spot['Reviews']
    spot.previewImage = spot.SpotImages[0].url
    delete spot['SpotImages']
    return spot
  })

  res.json(ratedSpots)
})





//post spot
router.post('/', requireAuth,isValid, async (req, res, next) => {
  const newSpot = await Spot.create({
    ...req.body
  })
    res.status(201).json(newSpot)
})



router.post('/:spotId/images', requireAuth,spotAuth,isOwner,isValidImage, async (req, res, next) => {
  
  const {spotId} = req.params
 
  const newImage = await SpotImage.create({
   ...req.body,
    spotId
  })

  res.status(201).json(newImage)

})




//edit a spotd
router.put('/:spotId',requireAuth,spotAuth,isOwner,isValid, async (req, res) => {
  
const {user} = req
  const id = req.params.spotId
 
    const edit = await Spot.findOne({
      where: {
        id
      }
    })
      await edit.update({
        ...req.body,
        spotId: id,
        ownerId: user.id
      })
      res.json({
        status: 'success',
        message: 'Successfully updated spot',
        data: edit
      })

    


})

//delete a spot given spoId
router.delete('/:spotId',requireAuth,spotAuth,isOwner, async (req, res, next) => {

  const { spotId } = req.params

 
  const deleted = await Spot.findOne({
    where: {
      id: spotId
    }
  })
 
   await deleted.destroy()
  res.json({
    status: "success",
    message: `Successfully removed spot ${spotId}`,
  });



})




router.post('/:spotId/reviews',requireAuth,spotAuth,isValidReview, async (req, res, next) => {
  const {spotId}= req.params
  const {user} = req

  const spot = await Spot.findOne({
    where: {
      id: spotId
    },
    include: [{
      model: Review
    }]
  })
 

  const reviews = spot.Reviews
  for (const review of reviews){
    if (review.userId === user.id) {
      const err = new Error('Review from the current user already exists for the Spot')
      err.status = 500
      next(err)
    }
  }
  const newReview = await Review.create({
    ...req.body,
    spotId: Number(spotId),
    userId: user.id
  })

  
  
    res.status(201).json(newReview)
 
})


router.get('/:spotId/reviews',spotAuth, async (req, res, next) => {
  const { spotId } = req.params
  let reviews = await Review.findAll({
    attributes:['id','userId','spotId','review','stars','createdAt','updatedAt'],
    where: {
      spotId
    },
    include:[{
      attributes:['id','firstName','lastName'],
      model: User
    },{
      attributes: ['id','url'],
      model: ReviewImage}]
  })
  res.json(reviews)
})



router.post('/:spotId/bookings',requireAuth,spotAuth,isOwner, async (req, res, next) => {
  const {spotId} = req.params
  const {user} = req
 
  const newBooking = await Booking.create({
      ...req.body,
      userId: user.id,
      spotId
  })
  res.status(201).json(newBooking)
})



router.get('/:spotId/bookings', requireAuth, spotAuth, async (req, res, next) => {
  const { user } = req
  const { spotId } = req.params
  const spot = await Spot.findOne({
    where:{
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
      res.json(booking)
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
      res.json(booking)
  }
})



module.exports = router