const express = require('express')
const app = express()
const port = 3000
const cypress = require('cypress')

app.get('/', (req, res) => {
  res.send('Hefmart API is running!')
});
app.post('/', (req, res) => {
  console.log(req);
  res.send('Hefmart API is running!')
});

app.get('/run-tests', async (req, res) => { 
  console.log(req);
    try {
        const response = await cypress.run({
          spec: 'cypress/e2e/spec.cy.js',
          browser: 'chrome',
          headless: true,
          video: true,
      
          setupNodeEvents(on, config) {
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