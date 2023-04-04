
import pkg from 'sequelize';
const { DataTypes, Model, Sequelize } = pkg;
export const UserModel = (sequelize) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};