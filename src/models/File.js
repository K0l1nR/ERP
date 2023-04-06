
import pkg from 'sequelize';
const { DataTypes } = pkg;
export const FileModel = (sequelize) => {
  const File = sequelize.define('file', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB,
    },
  });
  return File;
};