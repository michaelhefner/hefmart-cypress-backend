const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    spec: 'spec.cy.js',
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
  },
})