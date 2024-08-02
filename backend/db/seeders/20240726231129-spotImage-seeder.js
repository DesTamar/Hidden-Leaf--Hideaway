'use strict';
const {SpotImage} = require('../models')
const spotimages = [
  {
    url: 'image-11',
    preview: 'Dark, sleek, and shadowy design',
    spotId: 1
  },
  {
    url: 'image-12',
    preview: 'Nice etched wooden walls',
    spotId: 1
  },
  {
    url: 'image-21',
    preview: 'Cloudy cozy design',
    spotId: 2
  },
  {
    url: 'image-22',
    preview: 'Electrifying atmosphere',
    spotId: 2
  },
  {
    url: 'image-31',
    preview: 'Nice mysterious atmosphere',
    spotId: 3
  },
  {
    url: 'image-32',
    preview: 'Serpentine themed pillars and wall art',
    spotId: 3
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
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
