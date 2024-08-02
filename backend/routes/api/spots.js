const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking,ReviewImage } = require('../../db/models');
const { requireAuth, spotAuth, isOwner} = require('../../utils/auth')
const {handleValidationErrors } = require('../../utils/validation')






//get spots
router.get('/', async (req, res) => {
  
  let spots = await Spot.findAll({
    include: [{ model: SpotImage },
    {
      model: Review,
      attributes: ['stars']
    },
    {
      model: SpotImage
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
      model: SpotImage
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
    return spot
  })

  res.json(ratedSpots)
})





//post spot
router.post('/', requireAuth,handleValidationErrors, async (req, res, next) => {
  const newSpot = await Spot.create({
    ...req.body
  })
    res.status(201).json(newSpot)
})




//edit a spotd
router.put('/:spotId',requireAuth,spotAuth,isOwner,handleValidationErrors, async (req, res) => {
  const { spotId } = req.body
  const id = req.params.spotId
 
    const edit = await Spot.findOne({
      where: {
        id: spotId
      }
    })
      await edit.update({
        ...req.body
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
    }]
  })
  reviews = reviews.map(review => review.toJSON())
  for await (const review of reviews){
   let result = await ReviewImage.findAll({
      where:{
        reviewId: review.id
      }
    })
    review.ReviewImages = result
    
  }
  res.json(reviews)
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


router.post('/:spotId/images', requireAuth,spotAuth,isOwner,handleValidationErrors, async (req, res, next) => {
  
  
  const newImage = await SpotImage.create({
    ...req.body
  })

  res.json(newImage)

})

module.exports = router