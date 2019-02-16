const express = require('express')
const middleware = require('./middleware')

const app = express()

middleware(app)

app.listen(3000, () => console.log('Listening on port 3000'))