const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth, spotAuth, isOwner } = require('../../utils/auth')



//get reviews of a spot given spotId
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
  

  //post review of a spot given spotId
router.post('/:spotId/reviews',requireAuth,spotAuth,isOwner, async (req, res, next) => {
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
  
    
    try {
      const newReview = await Review.create({
        ...req.body
      })
      res.status(201).json(newReview)
    } catch (error) {
      error = new Error('Body validation errors')
      error.status = 400
      next(error)
    }
  })





module.exports = router