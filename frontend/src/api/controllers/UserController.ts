import { User, UserControllerEntity, AppUser } from '../../../../shared';
import formatApiEndpoint from 'api/formatApiEndpoint';
import formatRequestOptions from 'api/formatRequestOptions';

class UserController implements UserControllerEntity {
  userPath: string;

  constructor() {
    this.userPath = formatApiEndpoint('user');
  }

  getByEmail = (email: string): Promise<User> => fetch(`${this.userPath}/${email}`).then((res) => res.json());

  getByUsername = (username: string): Promise<User> =>
    fetch(`${this.userPath}/name/${username}`).then((res) => res.json());

  isDuplicateUsername = async (username: string) => {
    const user = await this.getByUsername(username);
    if (user) throw new Error('Username is chosen');

    return false;
  };

  isDuplicateEmail = async (email: string) => {
    const user = await this.getByEmail(email);
    if (user) throw new Error('Email is chosen');

    return false;
  };

  create = (user: Partial<AppUser>) => fetch(this.userPath, formatRequestOptions(user)).then((res) => res.json());

  update = (user: User) => fetch(this.userPath, formatRequestOptions(user, undefined, 'PUT')).then((res) => res);

  deleteByUsername = (username: string) =>
    fetch(`${this.userPath}/name/${username}`, formatRequestOptions(undefined, undefined, 'DELETE')).then((r) =>
      r.json()
    );
}

const UserControllerInstance = new UserController();

export default UserControllerInstance;
