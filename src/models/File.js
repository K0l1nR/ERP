
import pkg from 'sequelize';
const { DataTypes, Model } = pkg;
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.BLOB("long"),
     
    },
  });
  return File;
};