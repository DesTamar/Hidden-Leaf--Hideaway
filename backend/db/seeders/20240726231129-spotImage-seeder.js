'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const {SpotImage} = require('../models')
const spotimages = [
  {
    url: 'image-11',
    preview: false,
    spotId: 1
  },
  {
    url: 'image-12',
    preview: true,
    spotId: 1
  },
  {
    url: 'image-21',
    preview: true,
    spotId: 2
  },
  {
    url: 'image-22',
    preview: false,
    spotId: 2
  },
  {
    url: 'image-31',
    preview: false,
    spotId: 3
  },
  {
    url: 'image-32',
    preview: true,
    spotId: 3
  },
]

/** @type {import('sequelize-cli').Migration} */
options.tableName = 'SpotImages';
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    try {
      await SpotImage.bulkCreate(spotimages, {validate: true})
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
      url: { [Op.in]: ['image-11','image-12','image-21','image-22','image-31','image-32'] }
    }, {});
  }
};
