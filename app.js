import express from 'express';
import { Sequelize } from 'sequelize';
import { UserModel } from './src/models/User.js';
import { FileModel } from './src/models/File.js';
import { sequelizeConfig } from './src/config/db.js';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import { userCredentials } from './src/middlewares/auth.js';


const app = express();
const port = 3000;
dotenv.config();


app.use(express.json()),
app.use(express.urlencoded({ extended: false }))



app.post('/login', (req, res) => {
  // Destructuring username & password from body
  const { username, password } = req.body;

  // Checking if credentials match
  if (username === userCredentials.username && 
      password === userCredentials.password) {
      
      //creating a access token
      const accessToken = jwt.sign({
          username: userCredentials.username,
          email: userCredentials.email
      }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10m'
      });
      // Creating refresh token not that expiry of refresh 
      //token is greater than the access token
      
      const refreshToken = jwt.sign({
          username: userCredentials.username,
      }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      // Assigning refresh token in http-only cookie 
      res.cookie('jwt', refreshToken, { httpOnly: true, 
          sameSite: 'None', secure: true, 
          maxAge: 24 * 60 * 60 * 1000 });
      return res.json({ accessToken });
  }
  else {
      // Return unauthorized error if credentials don't match
      return res.status(406).json({ 
          message: 'Invalid credentials' });
  }
})

app.post('/new_token', (req, res) => {
  if (req.cookies?.jwt) {

      // Destructuring refreshToken from cookie
      const refreshToken = req.cookies.jwt;

      // Verifying refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
      (err, decoded) => {
          if (err) {

              // Wrong Refesh Token
              return res.status(406).json({ message: 'Unauthorized' });
          }
          else {
              // Correct token we send a new access token
              const accessToken = jwt.sign({
                  username: userCredentials.username,
                  email: userCredentials.email
              }, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: '10m'
              });
              return res.json({ accessToken });
          }
      })
  } else {
      return res.status(406).json({ message: 'Unauthorized' });
  }
})


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