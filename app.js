/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import { Sequelize } from 'sequelize';
import { UserModel } from './src/models/User.js';
import { FileModel } from './src/models/File.js';
import multer from 'multer';
import { sequelizeConfig } from './src/config/db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';


const app = express();
const port = 3000;
dotenv.config();


app.use(express.json()),
app.use(express.urlencoded({ extended: false }));


const storage = multer.diskStorage({
  destination: function(req, file, cb) {

  
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname  }-${  Date.now() }${path.extname(file.originalname)}`);
  }
});

const maxSize = 1 * 1000 * 1000; // max 1 MB

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function(req, file, cb){

    
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb('Error: File upload only supports the ' + `following filetypes - ${  filetypes}`);
  }


}).single('file');

app.post('/upload', (req, res) => {
  upload(req, res => {
    const file = File.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync
    });
    res.send(req.file);
  });

});



app.post('/refresh', async(req, res) => {
  console.log(req.user);
});


app.post('/signin', async(req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });


  if (email === user.email &&
        password === user.password) {


    const accessToken = jwt.sign({
      email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10m'
    });

    const refreshToken = jwt.sign({
      email: user.email,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    // const token = await JWT_token.create({

    //   userEmail: user.email
    // })

    return res.json({
      accessToken,
      accessTokenTtl: process.env.ACCESS_TOKEN_TTL, //TODO - Get from .env
      refreshToken,
      refreshTokenTtl: process.env.REFRESH_TOKEN_TTL
    });
  }
  else {
    return res.status(406).json({
      message: 'Invalid credentials' });
  }
});


app.post('/signup', async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    res.status().json({
      message: 'User is already exist'
    });

  }
  const newUser = await User.create({
    email,
    password
  });
  res.send(newUser);

});


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
// const JWT_token = TokenModel(sequelize);

User.sync({ alter: true });
File.sync({ alter:true });
// JWT_token.sync({alter:true});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});