module.exports = {
  preset: 'ts-jest',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  moduleDirectories: ['.', 'src', 'node_modules'],
  // first you tell Jest to run the mock file each time an image import is encountered
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'src/__mocks__/fileMock.js',
    '\\.(css|less)$': 'src/__mocks__/fileMock.js',
  },
};
