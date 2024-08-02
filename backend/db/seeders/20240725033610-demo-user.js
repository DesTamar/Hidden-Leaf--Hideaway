'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users';
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'shikashadow@leaf.com',
        username: 'shikashadow',
        firstName: 'Shikamaru',
        lastName: 'Nara',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'mangekyou@akatsuki.com',
        username: 'genmaster',
        firstName: 'Itachi',
        lastName: 'Uchiha',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'snakesss@sound.com',
        username: 'snakesage',
        firstName: 'Orochimaru',
        lastName: 'Mitsuki',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['shikashadow', 'genmaster', 'snakesage'] }
    }, {});
  }
};
