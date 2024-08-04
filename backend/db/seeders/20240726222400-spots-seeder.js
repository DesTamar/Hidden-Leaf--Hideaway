'use strict';
const {Spot} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spots = [
  {
    ownerId: 1,
    address: '1 nara road',
    city: 'Clan Forest',
    state: 'Konohagahkure',
    country: 'Land of Fire',
    lat: 30,
    lng: 123.4,
    name: 'Nara Shadows',
    description: 'Our cozy cabins are designed with Nara aesthetics in mind. Dark wooden panels blend seamlessly with the forest surroundings and each room features intricate shadow patterns etched into the walls.',
    price: 250
  },
  {
    ownerId: 2,
    address: '2 Hideaway rd',
    city: 'Rainstown',
    state: 'Kumogakure',
    country: 'Land of Clouds',
    lat: 40,
    lng: 100.1,
    name: 'Nimbus Nook',
    description: "Welcome to the cloudtop retreat, a hiddn gem nestled high in the mist-shrouded peaks of Kumogakure As you ascend the winding mountain path, you'll feel the electric atmoshpere",
    price: 200
  },
  {
    ownerId: 3,
    address: '3 ryuchi Cave',
    city: 'Lablair',
    state: 'Otogakure',
    country: 'Land of Sound',
    lat: 50,
    lng: 101.2,
    name: 'Serpent Sanctum',
    description: "Welcome to the Serpents Sanctum, nestled within the ancient caverns of Ryuchi Cave. Here, the mythical intertwines with the practical, offering a tranquil escape for the shinobi and travelers alike.",
    price: 300
  }
]
/** @type {import('sequelize-cli').Migration} */
options.tableName = 'Spots';
module.exports = {
  async up (queryInterface, Sequelize) {
      await Spot.bulkCreate(spots, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
   await queryInterface.bulkDelete(options,{
    city: { [Op.in]: ['Clan Forest','Rainstown' ,'Lablair'] }
   },{})
  }
};
