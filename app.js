const { auth } = require('express-openid-connect');
const express = require('express')
const app = express()
const port = 9001
const cypress = require('cypress')
const { requiresAuth } = require('express-openid-connect');

require('dotenv').config()
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.post('/token-check', async (req, res) => {
  console.log(req.body);
   let accessToken = req.body.token;
   if (accessToken.isExpired()) {
     accessToken = await accessToken.refresh();
   }
});
app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Hefmart API is running!')
});

app.get('/run-tests', requiresAuth(), async (req, res) => { 
  console.log(req);
    try {
        const response = await cypress.run({
          spec: 'cypress/e2e/spec.cy.js',
          browser: 'chrome',
          headless: true,
          video: true,
      
          setupNodeEvents(on) {
            on('after:spec', (spec, results) => {
              if (results.video) {
                console.log('Video:', results)
                const timestamp = Date.now()
                fs.renameSync(results.video, `assets/videos/${results.spec.fileName}-${timestamp}.mp4`)
              }
            })
          },
        }).then((results) => results.runs[0]).catch((error) => error);
        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(500).send('Tests failed!')
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})