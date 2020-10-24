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

  // create 3 users
  for (let i = 0; i < 3; i++) userIds.push(await UserServiceInstance.create(fakeUser()));

  // create 10 sneakers
  for (let j = 0; j < 10; j++) {
    const sneakerId = await SneakerServiceInstance.create(fakeSneaker());
    sneakerIds.push(sneakerId);
  }

  // each user will list 5 sneakers
  for (const userId of userIds) {
    for (let k = 0; k < 5; k++) {
      const num = getRand(0, sneakerIds.length - 1);

      const productId = sneakerIds[num];

      await ListedSneakerServiceInstance.create(fakeListedSneaker(userId, productId));
    }
  }
};

export default initListedSneakerTable;
