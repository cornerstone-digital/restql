const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const gql = require('graphql-tag')
const { filter } = require('graphql-anywhere')
const queryString = require('query-string')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse text/html
app.use(bodyParser.text({ type: 'text/html' }))

app.post('/restql', async (req, res, next) => {
    try {
      const forwardHeaders = req.headers['forward-headers']
      const headers = {}
      console.log('Cookies', req.cookies)

      if (forwardHeaders) {
        const headerKeys = forwardHeaders.split(',')
        headerKeys.forEach((key) => {
          headers[key] = req.headers[key.toLowerCase()]
        })
      }

      const AxiosClient = await axios.create({
        baseURL: req.headers.baseurl,
        headers
      })

      const options = {
        method: req.headers.method,
        url: req.headers.path,
        params: queryString.parse(req.headers.params),
        timeout: 10000
      }

      const response = await AxiosClient(options)
      let query
      if (req.body.length) {
        query = gql`${req.body}`
      }
  
      if (response) {
        let result

        if (response.data) {
          if (query) {
            // Filter the data!
            result = filter(
              query,
              response.data
            )
          }
        }

        res.status(response.status).send(result ? result : response.data)
      }
    } catch (e) {
      // res.status(500).send(new Error(e))
      console.error(e)
    }

    // console.log(query)

    // res.sendStatus(200)
})

app.listen(3000, () => console.log('Listening on port 3000'))