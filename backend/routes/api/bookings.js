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

router.put('/:bookingId',requireAuth,async (req,res,next)=> {
    const {bookingId} = req.params
    const {user} = req
   
    const oldBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    const bk = await Booking.findOne({
        where: {
            id: bookingId
        },
        include:[{
            model: Spot
        }]
    })
    if (!oldBooking){
        const err = new Error('Booking could not be found')
        err.status = 404
        next (err)
    }
    const spotId = bk.Spot.id
    if (user.id === oldBooking.userId){
        err = new Error('Not the owner of this booking')
        next(err)
    }
    const newBooking =  oldBooking.set({
       ...req.body,
       userId: user.id,
       spotId
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