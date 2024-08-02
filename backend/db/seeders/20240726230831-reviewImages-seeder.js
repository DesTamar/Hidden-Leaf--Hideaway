'use strict';
const {ReviewImage} = require('../models');

const reviewImages = [
{
  url: 'image-21',
  preview: 'Very pleasant stay',
  reviewId: 1
},
{
  url: 'image-23',
  preview: 'Enjoyed the mysterious feel',
  reviewId: 2
},
{
  url: 'image-32',
  preview: 'Serene overall.',
  reviewId: 3
},
{
  url: 'image-31',
  preview: 'Very much enjoyed the shadowy decor.',
  reviewId: 4
},
{
  url: 'image-13',
  preview: 'Very unique experience, but a little creepy.',
  reviewId: 5
},
{
  url: 'image-12',
  preview: 'Serene and pleasantly cozy.',
  reviewId: 6
},
]

/** @type {import('sequelize-cli').Migration} */
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
    await queryInterface.bulkDelete('ReviewImages', null, {});
  }
};
