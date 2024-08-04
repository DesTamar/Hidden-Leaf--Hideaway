const express = require('express')
const router = express.Router();
const { SpotImage,Spot } = require('../../db/models')
const { requireAuth, spotAuth, isOwner, isValidReview,isValid,isValidImage} = require('../../utils/auth')


router.delete('/:imageId',requireAuth, async (req, res, next) => {
  const { imageId } = req.params
  const { user } = req
  const currImaged = await SpotImage.findOne({
    where: {
      id: imageId
    },
    include: [
      {model:Spot}
    ]

  
  })
  if (!currImaged) {
    const err = new Error("Couldn't find a SpotImage with the specified id")
    err.status = 404
    next(err)
  }
  const spot = currImaged.Spot
    if (user.id !== spot.ownerId) {

    const err = new Error('You are not the owner of this spot')
    err.title = 'Not the owner'
    err.errors = { message: 'Not the owner' };
    err.status = 403;
    return next(err)

  };
  
    currImaged.destroy()
    res.json({
      status: "success",
      message: `Successfully removed image ${imageId}`,
    })
 
})





module.exports = router