import React, { Component } from 'react';

import onFederatedSignin from 'usecases/onFederatedSignin';
import UserControllerInstance from 'api/controllers/UserController';

type SignInWithFacebookProps = {
  handleSignin: (errMessage: string) => void;
};

// To federated sign in from Facebook
class SignInWithFacebook extends Component<SignInWithFacebookProps> {
  constructor(props: any) {
    super(props);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    if (!(window as any).FB) this.createScript();
  }

  signIn() {
    const fb = (window as any).FB;
    fb.getLoginStatus((response: any) => {
      if (response.status === 'connected') this.getAWSCredentials(response.authResponse);
      else {
        fb.login(
          (response: any) => {
            if (!response || !response.authResponse) return;
            this.getAWSCredentials(response.authResponse);
          },
          {
            // the authorized scopes
            scope: 'public_profile,email',
          }
        );
      }
    });
  }

  getAWSCredentials(response: any) {
    const { accessToken, expiresIn } = response;
    const date = new Date();
    const expires_at = expiresIn * 1000 + date.getTime();

    if (!accessToken) return;

    const fb = (window as any).FB;
    fb.api('/me', { fields: 'name, email' }, (response: any) => {
      const user = {
        name: response.name,
        email: response.email,
      };

      onFederatedSignin(UserControllerInstance)('facebook', accessToken, expires_at, user).catch((err) => this.props.handleSignin(err.message));
    });
  }

  createScript() {
    // load the sdk
    (window as any).fbAsyncInit = this.fbAsyncInit;
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = this.initFB;
    document.body.appendChild(script);
  }

  initFB = () => (window as any).FB;

  fbAsyncInit() {
    // init the fb sdk client
    const fb = (window as any).FB;
    fb.init({
      appId: process.env.REACT_APP_FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v2.11',
    });
  }

  render() {
    return (
      <button className='fb-btn connect' type='button' onClick={this.signIn}>
        Sign in with Facebook
      </button>
    );
  }
}

export default SignInWithFacebook;
