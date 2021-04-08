module.exports = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Ensures no server modules are included on the client.
      config.plugins.push(new webpack.IgnorePlugin(/lib\/server/));
    }

    return config;
  },
};
