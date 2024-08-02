const express = require('express')
const router = express.Router();
const { SpotImage, Spot, Review, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth, spotAuth, isOwner } = require('../../utils/auth')



//get bookings of a spot given spotId
// router.get('/:spotId/bookings', requireAuth, spotAuth, async (req, res, next) => {
//     const { user } = req
//     const { spotId } = req.params

//     if (user.id !== spot.ownerId) {
//         const booking = await Booking.findAll({
//             attributes: ['spotId', 'startDate', 'endDate'],
//             where: {
//                 spotId
//             }
//         })
//         res.json(booking)
//     } else {
//         const booking = await Booking.findAll({
//             where: {
//                 spotId
//             },
//             include: [{
//                 attributes: ['id', 'firstName', 'lastName'],
//                 model: User
//             }]
//         })
//         res.json(booking)
//     }
// })

//post booking of a spot given spotId
// router.post('/:spotId/bookings', async (req, res, next) => {
//     const id = req.params.spotId

//     const { spotId, userId, startDate, endDate } = req.body
//     const newBooking = await Booking.create({
//         spotId,
//         userId,
//         startDate,
//         endDate
//     })
//     res.json(newBooking)
// })


module.exports = router