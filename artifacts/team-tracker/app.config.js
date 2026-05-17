/** @type {(props: import('expo/config').ConfigContext) => import('expo/config').ExpoConfig} */
module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    config: {
      ...config.ios?.config,
      googleMapsApiKey: process.env._MAPS_3D_SDK_FOR_IOS ?? "",
    },
  },
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env._MAPS_3D_SDK_FOR_ANDROID ?? "",
      },
    },
  },
  plugins: config.plugins ?? [],
});
