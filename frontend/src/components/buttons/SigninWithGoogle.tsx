import React, { Component } from 'react';
import onFederatedSignin from 'usecases/onFederatedSignin';

type SignInWithGoogleProps = {
  handleSignin: (errMessage: string) => void;
};

// To federated sign in from Google
class SignInWithGoogle extends Component<SignInWithGoogleProps> {
  btnImg: string;

  constructor(props: any) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.btnImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png';
  }

  componentDidMount() {
    const ga = (window as any).gapi && (window as any).gapi.auth2 ? (window as any).gapi.auth2.getAuthInstance() : null;
    if (!ga) this.createScript();
  }

  signIn() {
    const ga = (window as any).gapi.auth2.getAuthInstance();
    ga.signIn().then(
      (googleUser: any) => {
        this.getAWSCredentials(googleUser);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  async getAWSCredentials(googleUser: any) {
    const { id_token, expires_at } = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();

    const user = {
      email: profile.getEmail(),
      name: profile.getName(),
    };

    try {
      await onFederatedSignin('google', id_token, expires_at, user);
    } catch (err) {
      this.props.handleSignin(err.message);
    }
  }

  createScript() {
    // load the Google SDK
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.onload = this.initGapi;
    document.body.appendChild(script);
  }

  initGapi() {
    // init the Google SDK client
    const g = (window as any).gapi;
    g.load('auth2', function () {
      g.auth2.init({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        // authorized scopes
        scope: 'profile email openid',
      });
    });
  }

  render() {
    return (
      <button
        onClick={this.signIn}
        type='button'
        style={{
          backgroundColor: 'white',
          color: 'black',
          width: '100%',
          fontSize: '1em',
          padding: '10px 0',
          marginBottom: '15px',
        }}
      >
        <img
          style={{ marginBottom: '3px', marginRight: '5px' }}
          width='20px'
          alt='Google signin'
          src={this.btnImg}
        />
        Sign in with Google
      </button>
    );
  }
}

export default SignInWithGoogle;
