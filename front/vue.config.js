module.exports = {
  publicPath: '/admin',
  devServer: {
    disableHostCheck: true,
    public: '0.0.0.0',
    sockPath: '/admin/sockjs-node',
    headers: {
      'Vary': '*'
    },
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/api/admin': {
        target: 'http://' + process.env.LOCAL_ADDRESS,
        changeOrigin: true
      }
    }
  }
}
