'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId'
        }
      )
    }
  }
  SpotImage.init({
    url: {
      type: DataTypes.STRING,
     
    },
    preview: {
      type: DataTypes.BOOLEAN
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};