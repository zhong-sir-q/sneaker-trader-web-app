import { User, UserEntity, AppUser, UserRankingRow } from '../../../../shared';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

export class UserController implements UserEntity {
  userPath: string;

  constructor() {
    this.userPath = formatApiEndpoint('user');
  }

  getRankingPointsByUserId = (userId: number): Promise<number> =>
    fetch(concatPaths(this.userPath, 'rankingPoints', userId)).then((res) => res.json());

  getAllUserRankingPoints = (): Promise<UserRankingRow[]> =>
    fetch(concatPaths(this.userPath, 'all', 'rankingPoints')).then((r) => r.json());

  getByEmail = (email: string): Promise<User | null> =>
    fetch(concatPaths(this.userPath, email)).then((res) => res.json());

  getByUsername = (username: string): Promise<User | null> =>
    fetch(`${this.userPath}/name/${username}`).then((res) => res.json());

  create = (user: Partial<AppUser>) => fetch(this.userPath, formatRequestOptions(user)).then((res) => res.json());

  update = (user: User) => fetch(this.userPath, formatRequestOptions(user, undefined, 'PUT')).then((res) => res);

  deleteByUsername = (username: string) =>
    fetch(`${this.userPath}/name/${username}`, formatRequestOptions(undefined, undefined, 'DELETE')).then((r) =>
      r.json()
    );
}

const UserControllerInstance = new UserController();

export default UserControllerInstance;
