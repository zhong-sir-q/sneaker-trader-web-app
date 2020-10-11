import faker from 'faker';
import { SocialProvider } from '../../../../shared';

const fakeUser = () => ({
  id: faker.random.number(),
  rankingPoints: faker.random.number(),
  profilePicUrl: faker.internet.url(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  gender: faker.random.word(),
  dob: faker.random.word(),
  email: faker.internet.email(),
  phoneNo: faker.phone.phoneNumber(),
  signinMethod: 'email' as SocialProvider | 'email',
});

export default fakeUser;
