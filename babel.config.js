module.exports = function babelConfig (api) {
  api.cache(true)

   /**
   * Babel presets
   */
  const presets = ['@babel/preset-env']

  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]

  return {
    presets,
    plugins
  }
}