
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
        return res.json({ 
                accessToken,
                accessTokenTtl: 60*10, //TODO - Get from .env
                refreshToken,
                refreshTokenTtl: 60*15
         });
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

  