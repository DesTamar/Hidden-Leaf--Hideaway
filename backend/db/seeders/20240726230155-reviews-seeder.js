'use strict';
const {Review} = require('../models');
const review = require('../models/review');
const reviews = [
  {
    userId: 2,
    spotId:  1,
    review: 'Very pleasant stay',
    stars: 5
  },
  {
    userId: 2,
    spotId: 3,
    review: 'Enjoyed the mysterious feel',
    stars: 5
  },
  {
    userId: 3,
    spotId: 2,
    review: 'Serene overall.',
    stars: 4
  },
  {
    userId: 3,
    spotId: 1,
    review: 'Very much enjoyed the shadowy decor.',
    stars: 4
  },
  {
    userId: 1,
    spotId: 3,
    review: 'Very unique experience, but a little creepy.',
    stars: 3
  },
  {
    userId: 1,
    spotId: 2,
    review: 'Serene and pleasantly cozy.',
    stars: 5
  }
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
      await Review.bulkCreate(reviews, {validate: true})
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
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
