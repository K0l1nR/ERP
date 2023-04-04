import express from 'express';
import { Sequelize } from 'sequelize';
import { UserModel } from './src/models/User.js';
import { FileModel } from './src/models/File.js';
import { sequelizeConfig } from './src/config/db.js';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


const app = express();
const port = 3000;
dotenv.config();


app.use(express.json()),
app.use(express.urlencoded({ extended: false }))


app.post('/signin', async (req, res) => {
  
    const { email, password } = req.body;
    const user = await User.findOne({where: {email}} )
    
 
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
  })
  
 
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: {email} });
    if ( user ) {
      throw new Error ("User is already exist")
    } 
  const newUser = await User.create({
    email,
    password
  })
  res.send(newUser)

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
 
User.sync({force:true});
File.sync({force:true});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});