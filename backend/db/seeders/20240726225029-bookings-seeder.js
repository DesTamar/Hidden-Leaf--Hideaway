'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


const {Booking} = require('../models')
const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: '2025-08-01',
    endDate: "2025-08-04"
  },
  {
    spotId: 2,
    userId: 3,
    startDate: '2025-08-02',
    endDate: "2025-08-05"
  },
  {
    spotId: 3,
    userId: 1,
    startDate: '2025-08-03',
    endDate: "2025-08-06"
  }
]
/** @type {import('sequelize-cli').Migration} */
options.tableName = 'Bookings';
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
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      startDate: { [Op.in]: ['2024-08-01','2024-08-02' ,'2024-08-03'] }
    },{})
  }
};
