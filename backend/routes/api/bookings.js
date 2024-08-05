const express = require('express')
const router = express.Router();
const { Booking, Spot,SpotImage } = require('../../db/models')
const { requireAuth, spotAuth, validDates } = require('../../utils/auth');
const { where } = require('sequelize');



router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req
    let booking = await Booking.findOne({
        attributes: ["userId", "startDate", "endDate", "createdAt", "updatedAt"],
        where: {
            userId: user.id
        },
        include: [{
            model: Spot,
            include:[
                {
                    model: SpotImage,
                    attributes:['url'],
                    where:{
                        preview: true
                    }
                }
            ]
        }]
    })

    booking = booking.toJSON()
    const url = booking.Spot.SpotImages[0].url
    booking.Spot.previewImage = url
    delete booking.Spot.SpotImages
    res.json(booking)
})



// {
//     "startDate": "2021-11-19",
//     "endDate": "2021-11-20"
//   }
router.put('/:bookingId', requireAuth, validDates, async (req, res, next) => {
    const { bookingId } = req.params
    const { user } = req
    let { startDate, endDate } = req.body
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        },
        include: [{
            model: Spot
        }]
    })
    const edit = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    if (!booking) {
        const err = new Error()
        err.message = "Couldn't find a Booking with the specified id"
        err.status = 404
       return next(err)
    }

    if (user.id !== booking.userId) {
        const err = new Error()
        err.message = "Booking must belong to current user"
        err.status = 403
       return next(err)
    }
    const currSpot = booking.Spot
    const allBookings = await Booking.findAll({
        include: [{
            model: Spot,
            where: {
                id: currSpot.id
            }
        }]
    })

    const err = new Error()
    err.errors = {}
    for (const bk of allBookings) {
        // if (booking.startDate <= bk.startDate && booking.endDate >= bk.endDate) {
        //     err.errors.dates = "dates cannot overlap with other bookings"
        //     err.status = 403
        //     next(err)
        // }

        // if (booking.startDate >= bk.startDate && booking.startDate <= bk.endDate) {
        //     err.errors.startDate = "Start date conflicts with exiting booking"
        // }
        // if (booking.endDate >= bk.startDate && booking.endDate <= bk.endDate) {
        //     err.errors.endDate = "End date conflicts with existing booking"
        // }
        // if (Object.keys(err.errors).length) {
        //     err.status = 403
        //     next(err)
        // }

    }




        const spotId = booking.Spot.id
        const newBooking = await edit.update({
            ...req.body,
            userId: user.id,
            spotId
      })
      res.status(200).json(newBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const { user } = req
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        },
        include: [{
            model: Spot
        }]
    })

    if (!booking) {
        const err = new Error()
        err.message = "Could not find booking with provided id"
        err.status = 404
       return next(err)
    }

    const spot = booking.Spot
    if (booking.userId !== user.id) {
        const err = new Error()
        err.message = "Must be author of booking or owner of spot to cancel"
        err.status = 403
        return next(err)
    } else if (spot.ownerId !== user.id){
        const err = new Error()
        err.message = "Must be author of booking or owner of spot to cancel"
        err.status = 403
       return next(err)
    }
    let startDate = booking.startDate
    startDate = new Date(startDate)
    let present = new Date()
    if (startDate.getTime() <= present.getTime()) {
        const err = new Error()
        err.message = "Bookings that have been started can't be deleted"
        err.status = 403
       return next(err)
    }

    await booking.destroy()
    res.json({
        message: `Successfully removed review ${bookingId}`
    })
      const bookings = await Booking.findAll()
      res.json(spot.ownerId)
})




module.exports = router