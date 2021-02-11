module.exports = {
  devServer: {
    port: 8888,
    disableHostCheck: true,
    proxy: {
      "^/api/": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        pathRewrite: { "^/api/": "/api/" }
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule
      .oneOf("component")
      .resourceQuery(/component/)
      .use("vue-svg-loader")
      .loader("vue-svg-loader")
      .end()
      .end();
    svgRule.oneOf("normal").uses.merge(svgRule.uses.entries());
    svgRule.uses.clear();

    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.transformAssetUrls = {
          img: "src",
          image: "xlink:href",
          "b-avatar": "src",
          "b-img": "src",
          "b-img-lazy": ["src", "blank-src"],
          "b-card": "img-src",
          "b-card-img": "src",
          "b-card-img-lazy": ["src", "blank-src"],
          "b-carousel-slide": "img-src",
          "b-embed": "src"
        };

        return options;
      });
  }
};
