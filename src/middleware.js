const axios = require('axios')
const bodyParser = require('body-parser')
const gql = require('graphql-tag')
const { filter } = require('graphql-anywhere')
const queryString = require('query-string')
const cookieParser = require('cookie-parser')

const middleware = (app, config) => {
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.text({ type: 'text/html' }))

  app.post('/restql', async (req, res, next) => {
      try {
        const forwardHeaders = req.headers['forward-headers']
        const headers = {}

        if (forwardHeaders) {
          const headerKeys = forwardHeaders.split(',')
          headerKeys.forEach((key) => {
            headers[key] = req.headers[key.toLowerCase()]
          })
        }

        const AxiosClient = await axios.create({
          baseURL: req.headers.baseurl ? req.headers.baseurl : config.baseUrl,
          headers
        })

        const options = {
          method: req.headers.method,
          url: req.headers.path,
          params: queryString.parse(req.headers.params),
          timeout: 10000
        }

        console.log('Options', options)

        const response = await AxiosClient(options)
        let query
        if (req.body.length) {
          query = gql`${req.body}`
        }
    
        if (response) {
          let result

          if (response.data) {
            // console.log(response.data)
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
        console.error(e)
        res.status(500).send(new Error(e))
      }
  })
}

module.exports = middleware
module.exports.default = middleware