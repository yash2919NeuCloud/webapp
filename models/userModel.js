const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); 
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
      validate: {
        notEmpty: true,
        isAlpha: {
          msg: 'First name should only contain letters',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: {
          msg: 'Last name should only contain letters',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        noSpaces(value) {
          if (value.trim() === '') {
            throw new Error('Password cannot be only spaces');
          }
        },
      },
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
        notEmpty: true
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
      defaultValue: DataTypes.NOW,
      allowNull: false,
      readOnly: true,
    },
  }, {
    timestamps: false,
  });

  User.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
  };
  User.prototype.updatePassword = function (newPassword) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
    this.setDataValue('password', hashedPassword);
  };
  
  module.exports = User;
