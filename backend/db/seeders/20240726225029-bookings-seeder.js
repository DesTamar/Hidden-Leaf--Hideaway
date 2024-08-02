'use strict';
const {Booking} = require('../models')
const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: '2024-08-01',
    endDate: "2024-08-04"
  },
  {
    spotId: 2,
    userId: 3,
    startDate: '2024-08-02',
    endDate: "2024-08-05"
  },
  {
    spotId: 3,
    userId: 1,
    startDate: '2024-08-03',
    endDate: "2024-08-06"
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    try {
      await Booking.bulkCreate(bookings, {validate: true})
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Bookings',null,{})
  }
};
