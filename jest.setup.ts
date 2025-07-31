require('react-native-gesture-handler/jestSetup');

// @ts-ignore
global.__reanimatedWorkletInit = () => {};

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native/Libraries/Image/Image', () => 'Image');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
