const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapActions: ["vuex", "mapActions"],
        mapGetters: ["vuex", "mapGetters"],
        mapMutations: ["vuex", "mapMutations"],
        mapState: ["vuex", "mapState"]
      })
    ]
  }
};
