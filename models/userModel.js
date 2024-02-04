const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Import your Sequelize instance
const bcrypt = require('bcrypt');

  
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      readOnly: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const saltRounds = 10; 
        const hashedPassword = bcrypt.hashSync(value, saltRounds);
        this.setDataValue('password', hashedPassword);
      },
      writeOnly: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      readOnly: true,
    },
    account_updated: {
      type: DataTypes.DATE,
      readOnly: true,
    },
  }, {
    timestamps: false, // Disable Sequelize's default timestamps (created_at, updated_at)
  });
  
  module.exports = User;
  