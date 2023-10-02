const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const { databaseVersion } = require('../../../../../CWRU-VIRT-FSF-PT-06-2023-U-LOLC/13-ORM/01-Activities/14-Stu_Validation/Solved/config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: id,
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag,
        key: id,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
