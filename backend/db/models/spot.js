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
      Spot.hasMany(
        models.Booking,
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
      )
      Spot.hasMany(
        models.Review,
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
      )
      Spot.hasMany(
        models.SpotImage,
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull:false
    },
    country: {
      type: DataTypes.STRING,
      allowNull:false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull:false
    },
    longitude:{
      type: DataTypes.FLOAT,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    avgRating: {
      type: DataTypes.FLOAT,
      allowNull:false
    },
    spotImages: {
      type: DataTypes.ARRAY(Object),
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};