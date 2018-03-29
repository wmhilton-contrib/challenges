module.exports = {
  verbose: false,

  testRegex: '(/__tests__/.*(\\.)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  snapshotSerializers: ['enzyme-to-json/serializer'],

  collectCoverageFrom: ['packages/*/src/**/*.{js,jsx,ts,tsx}', '!**/__tests__.*'],
};
