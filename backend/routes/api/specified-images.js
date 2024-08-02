const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth, spotAuth, isOwner,isValid} = require('../../utils/auth')
const {handleValidationErrors} = require('../../utils/validation')



router.post('/:spotId/images', requireAuth,spotAuth,isOwner,isValid, async (req, res, next) => {
  
  const {spotId} = req.params
  // const {url,preview} = req.body
  const newImage = await SpotImage.create({
   ...req.body,
    
  })

  res.json(newImage)

})





module.exports = router