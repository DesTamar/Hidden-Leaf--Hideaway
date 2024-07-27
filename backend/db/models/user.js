'use strict';
const { Model, Validator } = require('sequelize');
// const {Booking,Spot} = require('../models')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      // class Book extends Model {
      //   static associate(models) {
      //     Book.belongsToMany(
      //       models.Reader,
      //         { through: models.BookReader,
      //           foreignKey: 'bookId',
      //           otherKey: 'readerId'
      //         }
      //         // additional attributes for the join table can be included in the options
      //     );
      //   }
      // }
      User.hasMany(
        models.Spot,
        {foreignKey: 'ownerId', onDelete: 'CASCADE', hooks:true}
      )
      User.hasMany(
        models.Booking,
        {foreignKey: 'userId', onDelete: 'CASCADE', hooks:true}
      )
      User.hasMany(
        models.Review,
        {foreignKey: 'userId', onDelete: 'CASCADE', hooks:true}
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  }
  );
  return User;
};