import { UserRegistrationEntity, AppUser } from '../../../../shared';
import formatApiEndpoint from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

export class UserRegistrationController implements UserRegistrationEntity {
  userRegistrationPath: string;

  constructor() {
    this.userRegistrationPath = formatApiEndpoint('user-registration');
  }

  register = (user: Partial<AppUser>) =>
    fetch(this.userRegistrationPath, formatRequestOptions(user))
    .then((res) => res.json());
}

const UserRegistrationControllerInstance = new UserRegistrationController();

export default UserRegistrationControllerInstance;
