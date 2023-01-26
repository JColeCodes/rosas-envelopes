const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Envelope extends Model {}

Envelope.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    envelope_text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'envelope'
  }
);

module.exports = Envelope;