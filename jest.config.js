module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.ts',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|@react-native-picker' +
      '|@react-native-async-storage' +
      '|react-native-css-interop' +
      '|nativewind' +
      '|tailwindcss' +
      '|react-redux' +
      '|redux-persist' +
      '|react-native-reanimated' +
      '|react-native-worklets' +
      ')/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  globals: {
    __DEV__: true,
  },
};
