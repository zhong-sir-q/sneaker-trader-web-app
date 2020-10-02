// 1. generate 3 users
// 2. create 10 different sneakers
// 3. each user list 1 ~ 5 sneakers

import UserService from '../../services/UserService';
import SneakerService from '../../services/SneakerService';
import ListedSneakerService from '../../services/ListedSneakerService';

import faker from 'faker';
import fakeUser from '../fakeUser';
import fakeSneaker from '../fakeSneaker';
import fakeListedSneaker from '../fakeListedSneaker';

const initListedSneakerTable = async () => {
  const UserServiceInstance = new UserService();
  const SneakerServiceInstance = new SneakerService();
  const ListedSneakerServiceInstance = new ListedSneakerService();

  const userIds: number[] = [];
  const sneakerIds: number[] = [];

  for (let i = 0; i < 3; i++) userIds.push(await UserServiceInstance.create(fakeUser()));
  for (let j = 0; j < 10; j++) {
    try {
      sneakerIds.push(await SneakerServiceInstance.create(fakeSneaker()));
    } catch {}
  }

  for (const userId of userIds) {
    const num = faker.random.number(sneakerIds.length - 1);
    const productId = sneakerIds[num];

    await ListedSneakerServiceInstance.create(fakeListedSneaker(userId, productId));
  }
};

export default initListedSneakerTable;
