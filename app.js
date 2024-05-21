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
        await cypress.run()
        res.send('Tests run successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).send('Tests failed!')
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})