import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import { Link } from 'react-router-dom'

import { CustomerContext } from 'providers/CustomerContextProvider';
import { API_BASE_URL } from 'routes';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

// TODO: what is the most optimal approach to get the user profile?

// a naive approach will be to just retrieve the Customer
// object from stripe and render the relevant fields

const fetchUserProfile = async (customerId: string): Promise<UserProfile> => {
  const profileEndpoint = API_BASE_URL + `customer?id=${customerId}`;
  const response = await fetch(profileEndpoint);
  const { profile } = await response.json();

  return profile;
};

// use the userId to update the user attributes in Cognito
const updateUserProfile = (customerId: string, userId: string, user: UserProfile) => {
  const updateUserEndpoint = API_BASE_URL + `customer/${customerId}?userId=${userId}`;
  const fetchOption: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };

  fetch(updateUserEndpoint, fetchOption);
};

const INIT_PROFILE_STATE: UserProfile = { name: '', email: '', phone: '' };

// the user have the ability to edit and save the changes here

// TODO: this page should be authenticated, i.e. only signed-in user
// can view it, other people will get redirected to the main page
const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(INIT_PROFILE_STATE);
  const { customerId, userId } = useContext(CustomerContext);

  useEffect(() => {
    (async () => {
      if (customerId !== '') {
        const profile = await fetchUserProfile(customerId);
        setUserProfile(profile);
      }
    })();
  }, [customerId, setUserProfile]);

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setUserProfile({
      ...userProfile,
      [evt.target.name]: evt.target.value,
    });

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        updateUserProfile(customerId, userId, userProfile);
      }}
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
