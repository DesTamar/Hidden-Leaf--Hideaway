const express = require('express')
const router = express.Router();
const { Review, ReviewImage ,User,Spot} = require('../../db/models')
const { requireAuth, spotAuth } = require('../../utils/auth');


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
        },{model: Spot},{model: ReviewImage}]
       
    })
    res.json(reviews)
})



router.post('/:reviewId/images', async (req, res, next) => {
    const id = req.params.reviewId
    const { url, preview, reviewId } = req.body
    const newReviewImage = await ReviewImage.create({
        url,
        preview,
        reviewId
    })
    res.json(newReviewImage)
})

router.put('/:reviewId', async (req, res, next) => {
    const { reviewId } = req.params

    const edit = await Review.findOne({
        where: {
            id: reviewId
        }
    })
    const { userId, spotId,review,stars} = req.body
    const edited = await edit.update({
        userId,
        spotId,
        review,
        stars
    })
    res.json(edited)
})




router.delete('/:reviewId',spotAuth, async (req, res, next) => {
    const { reviewId } = req.params

    const deleted = await Review.findOne({
        where: {
            id: reviewId
        }
    })
   if (deleted) {
    deleted.destroy()
    res.json({
        status: "success",
        message: `Successfully removed review ${reviewId}`,
    })
   } 
})





module.exports = router