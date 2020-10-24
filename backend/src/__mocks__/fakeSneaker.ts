import faker from 'faker';
import fakeImgUrls from './fakeImgUrls';

const fakeSneaker = () => ({
  name: faker.name.findName(),
  brand: faker.lorem.word(),
  size: faker.random.number(),
  colorway: faker.internet.color(),
  imageUrls: fakeImgUrls()
});

export default fakeSneaker;
