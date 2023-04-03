import express from 'express';
import { Sequelize } from 'sequelize';
import { UserModel } from './src/models/User.js';
import { FileModel } from './src/models/File.js';
import { sequelizeConfig } from './src/config/db.js';

const app = express();
const port = 3000;

const sequelize = new Sequelize(sequelizeConfig);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

const User = UserModel(sequelize);
const File = FileModel(sequelize);

User.sync();
File.sync();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});