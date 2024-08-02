const express = require('express')
const router = express.Router();
const {Booking,Spot} = require('../../db/models')
const { requireAuth } = require('../../utils/auth')



router.get('/current',requireAuth, async (req,res,next) => {
    const {user} = req
    const bookings = await Booking.findOne({
        where: {
            userId: user.id
        },
        include: [{
            model: Spot
        }]
    })
    res.json(bookings)
})

router.put('/:bookingId',async (req,res,next)=> {
    const {bookingId} = req.params
    const {spotId,userId,startDate,endDate} = req.body
    const oldBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    const newBooking =  oldBooking.set({
        spotId,
        userId,
        startDate,
        endDate
    })
   await newBooking.save()
    res.json(newBooking)
})

router.delete('/:bookingId', async (req,res,next) => {
    const { bookingId } = req.params

    const deleted = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
   if (deleted) {
    deleted.destroy()
    res.json({
        status: "success",
        message: `Successfully removed review ${bookingId}`,
    })
   } else {
          const err =  new Error('There is not spot with the provided bookingId')
          err.status = 400
          next(err)
        }
})




module.exports = router