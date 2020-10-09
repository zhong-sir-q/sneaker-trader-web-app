import faker from 'faker';

const fakeUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  gender: faker.random.word(),
  dob: faker.random.word(),
  email: faker.internet.email(),
  phoneNo: faker.phone.phoneNumber(),
  signinMethod: 'email' as 'email',
});

export default fakeUser;
