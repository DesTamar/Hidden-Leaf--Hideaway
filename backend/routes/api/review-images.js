const express = require('express')
const router = express.Router();
const {ReviewImage} = require('../../db/models')
const { requireAuth, spotAuth } = require('../../utils/auth')






router.delete('/:imageId',requireAuth,spotAuth, async (req,res,next) => {
    const {imageId} = req.params
    const deleted = await ReviewImage.findOne({
        where: {
            id: imageId
        }
    })
    if (deleted) {
        deleted.destroy()
        res.json({
            status: "success",
            message: `Successfully removed spot ${imageId}`,
          });
    } 
})



module.exports = router



 
