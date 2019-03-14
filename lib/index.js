"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var axios = require('axios');

var bodyParser = require('body-parser');

var gql = require('graphql-tag');

var _require = require('graphql-anywhere'),
    filter = _require.filter;

var queryString = require('query-string');

var cookieParser = require('cookie-parser');

var middleware = function middleware(app, config) {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.text({
    type: 'text/html'
  }));
  app.post('/restql',
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(req, res, next) {
      var forwardHeaders, headers, headerKeys, AxiosClient, options, response, query, result;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              forwardHeaders = req.headers['forward-headers'];
              headers = {};

              if (forwardHeaders) {
                headerKeys = forwardHeaders.split(',');
                headerKeys.forEach(function (key) {
                  headers[key] = req.headers[key.toLowerCase()];
                });
              }

              _context.next = 6;
              return axios.create({
                baseURL: req.headers.baseurl ? req.headers.baseurl : config.baseUrl,
                headers: headers
              });

            case 6:
              AxiosClient = _context.sent;
              options = {
                method: req.headers.method,
                url: req.headers.path,
                params: queryString.parse(req.headers.params),
                timeout: 10000
              };
              console.log('Options', options);
              _context.next = 11;
              return AxiosClient(options);

            case 11:
              response = _context.sent;

              if (req.body.length) {
                query = gql(_templateObject(), req.body);
              }

              if (response) {
                if (response.data) {
                  // console.log(response.data)
                  if (query) {
                    // Filter the data!
                    result = filter(query, response.data);
                  }
                }

                res.status(response.status).send(result ? result : response.data);
              }

              _context.next = 20;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
              res.status(500).send(new Error(_context.t0));

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 16]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
};

module.exports = middleware;
module.exports.default = middleware;
