module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        native: true,
      },
    ],
  ],
};