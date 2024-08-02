'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const {ReviewImage} = require('../models');

const reviewImages = [
{
  url: 'image-21',
  preview: false,
  reviewId: 1
},
{
  url: 'image-23',
  preview: true,
  reviewId: 2
},
{
  url: 'image-32',
  preview: true,
  reviewId: 3
},
{
  url: 'image-31',
  preview: false,
  reviewId: 4
},
{
  url: 'image-13',
  preview: false,
  reviewId: 5
},
{
  url: 'image-12',
  preview: true,
  reviewId: 6
},
]

/** @type {import('sequelize-cli').Migration} */
options.tableName = 'ReviewImages';
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
      await ReviewImage.bulkCreate(reviewImages, {validate: true})
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
    await queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
