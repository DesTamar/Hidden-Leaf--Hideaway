'use strict';
const {
  Model
} = require('sequelize');
// const {Booking,Review} = require('../models')
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
          { foreignKey: 'ownerId' }
      );
      Spot.belongsToMany(
        models.User,
        {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId',
         
          hooks:true
        }
      )
      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId',
          
          hooks:true
        }
      )
      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks:true
        }
      )
      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE'
        }
      )
      Spot.hasMany(
        models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: {
        msg: "Street address is required"
      },
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: {
        msg:  "City is required"
      },
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull:{
        msg: "State is required"
      },
      validate: {
        notEmpty: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull:{
        msg: "Country is required"
      },
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull:false,
      validate: {
        isFloat: true
      }
    },
    longitude:{
      type: DataTypes.FLOAT,
      allowNull:false,
      validate: {
        isFloat: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true,
        len: [1,50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        isInt: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};