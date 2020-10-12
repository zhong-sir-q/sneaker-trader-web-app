// 1. generate 3 users
// 2. create 10 different sneakers
// 3. each user list 1 ~ 5 sneakers

import UserService from '../../services/UserService';
import SneakerService from '../../services/SneakerService';
import ListedSneakerService from '../../services/ListedSneakerService';

import fakeUser from '../fakeUser';
import fakeSneaker from '../fakeSneaker';
import fakeListedSneaker from '../fakeListedSneaker';

const getRand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const initListedSneakerTable = async () => {
  const UserServiceInstance = new UserService();
  const SneakerServiceInstance = new SneakerService();
  const ListedSneakerServiceInstance = new ListedSneakerService();

  const userIds: number[] = [];
  const sneakerIds: number[] = [];

  for (let i = 0; i < 3; i++) userIds.push(await UserServiceInstance.create(fakeUser()));
  for (let j = 0; j < 10; j++) {
    const sneakerId = await SneakerServiceInstance.create(fakeSneaker());
    sneakerIds.push(sneakerId);
  }

  for (const userId of userIds) {
    for (let k = 0; k < 3; k++) {
      const num = getRand(0, sneakerIds.length - 1);

      const productId = sneakerIds[num];

      await ListedSneakerServiceInstance.create(fakeListedSneaker(userId, productId));
    }
  }
};

export default initListedSneakerTable;
