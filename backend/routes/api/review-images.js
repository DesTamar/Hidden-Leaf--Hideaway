const express = require('express')
const router = express.Router();
const {ReviewImage,Review,User,Spot,Booking} = require('../../db/models')
const { requireAuth } = require('../../utils/auth')






router.delete('/:imageId',requireAuth, async (req,res,next) => {
    const {imageId} = req.params
    const {user} = req

    const deleted = await ReviewImage.findOne({
        where: {
            id: imageId
        },
        include: [{
            model: Review,
        }]
    })

    if (!deleted) {
        const err = new Error()
        err.message = "No Image with the provided id was found"
        err.status = 404
        return next(err)
    } 
    const review = deleted.Review
    const spot = await Spot.findOne({
        where: {
            id: review.spotId
        }
    })

   if (user.id !== spot.ownerId){
    const err = new Error()
    err.message = "Spot must belong to the current user"
    err.status = 403
    return next(err)
   }


    deleted.destroy()
    res.json({
        status: "success",
        message: `Successfully removed reviewImage ${imageId}`,
      });
})



module.exports = router



 
