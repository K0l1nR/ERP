import { DB, USER, PASSWORD, HOST, dialect as _dialect, pool as _pool, sequelizeConfig } from '../config/db.js';

import Sequelize from 'sequelize';
const sequelize = new Sequelize(sequelizeConfig);

const db = {};

db.Sequelize = Sequelize;
db.connection = sequelize;

// Our `Users` Model, we will create it in next step
db.users = require('./User.js')(db.connection, db.Sequelize);

export default db;
