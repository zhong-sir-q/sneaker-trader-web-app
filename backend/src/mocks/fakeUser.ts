import faker from 'faker';

const fakeUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  gender: faker.random.word(),
  dob: faker.date.past().toString(),
  email: faker.internet.email(),
});

export default fakeUser;
