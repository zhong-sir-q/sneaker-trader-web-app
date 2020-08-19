import React, { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom'

type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

// TODO: get and update the user profile here

const INIT_PROFILE_STATE: UserProfile = { name: '', email: '', phone: '' };

// the user have the ability to edit and save the changes here

// TODO: this page should be authenticated, i.e. only signed-in user
// can view it, other people will get redirected to the main page
const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(INIT_PROFILE_STATE);

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setUserProfile({
      ...userProfile,
      [evt.target.name]: evt.target.value,
    });

  return (
    <form
      onSubmit={(evt) => {evt.preventDefault();}}
    >
      <div>
        <label>Name</label>
        <input name="name" value={userProfile.name} onChange={onInputChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={userProfile.email} onChange={onInputChange} />
      </div>
      <div>
        <label>Phone Number</label>
        <input name="phone" value={userProfile.phone} onChange={onInputChange} />
      </div>
      <button type="submit">Save Changes</button>
      <Link to='/'>Go back home</Link>
    </form>
  );
};

export default Profile;
