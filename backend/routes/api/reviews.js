const express = require('express')
const router = express.Router();
const { Review, ReviewImage ,User,Spot} = require('../../db/models')
const { requireAuth, spotAuth ,revAuth,isReviewOwner, isValidReview} = require('../../utils/auth');


router.get('/current',requireAuth, async (req, res, next) => {
    const { user } = req
    const reviews = await Review.findAll({
        attributes: ['id','userId', 'spotId', 'review','stars', 'createdAt', 'updatedAt'],
        where: {
            userId: user.id
        },
        include: [{
            attributes: ['id','firstName','lastName'],
            model: User
        },{model: Spot},{
            attributes: ['id','url'],
            model: ReviewImage}]
       
    })
    res.json(reviews)
})



router.post('/:reviewId/images',requireAuth,revAuth,isReviewOwner, async (req, res, next) => {
    const {reviewId} = req.params
    const review = await Review.findOne({
        where:{
            id: reviewId,
        },
        include: [{
            model: ReviewImage
        }]
    })
    if (review.ReviewImages.length >= 10 ){
        const err = new Error('Cannot add more than 10 more images per resource')
        err.status = 403
        next(err)
    }
    
    const newReviewImage = await ReviewImage.create({
        ...req.body,
        reviewId
    })
    res.status(201).json(newReviewImage)
})

router.put('/:reviewId',requireAuth,revAuth,isReviewOwner,isValidReview, async (req, res, next) => {
    const { reviewId } = req.params
    const {user} = req
    const rev = await Review.findOne({
        where: {
            id: reviewId
        }
    })
    const edit = await Review.findOne({
        where: {
            id: reviewId
        },
        include: [{
            model: Spot
        }]
    })
    const spotId = edit.Spot.id
    const edited = await rev.update({
       ...req.body,
       userId: user.id,
       spotId
    })
   
    res.json(edited)
})




router.delete('/:reviewId',requireAuth,revAuth,isReviewOwner, async (req, res, next) => {
    const { reviewId } = req.params

    const deleted = await Review.findOne({
        where: {
            id: reviewId
        }
    })
   if (deleted) {
    deleted.destroy()
    res.json({
        message: `Successfully removed review ${reviewId}`,
    })
   } 
})





module.exports = router