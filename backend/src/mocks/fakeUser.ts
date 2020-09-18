import faker from 'faker'

const fakeUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.name.findName(),
  gender: faker.random.word(),
  dob: faker.date.past(),
  email: faker.internet.email(),
};

export default fakeUser;
