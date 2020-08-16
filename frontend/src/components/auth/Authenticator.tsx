// NOTE: the code in this file is not used currently, but it serves a good purpose of template
// if we ever need to use this form in the future. Obviously it requires a lot of refactoring
import React from 'react';
import { Auth } from 'aws-amplify';

type UserCredentials = {
  email: string;
  password: string;
};

type AuthStep = 'signin' | 'signup' | 'confirm-signup';

const INIT_CREDENTIALS: UserCredentials = {
  email: '',
  password: '',
};

/**
 * TODO:
 * - customize the sign in, sign up, confirm sign up, reset password flow
 * - add ability to sign in with third-party providers
 * - when the user is signed in (check if the user exist in the database, if not, create a stripe er
 * in association with it, brute force approach, does not matter too much in small scale app, need to
 * think of optimization later)
 * - ize the error message
 */
const signUp = async (username: string, password: string) =>
  Auth.signUp({
    username,
    password,
  });

const signIn = (email: string, password: string) =>
  Auth.signIn(email, password)
    .then((user) => console.log({ user }))
    .catch((err) => alert(err.message));

const confirmSignUp = (email: string, code: string) => Auth.confirmSignUp(email, code).catch((err) => alert(err.meesage));

const resendConfirmationCode = (email: string) => Auth.resendSignUp(email);

// TODO: what is the best solution for updating the current auth state when each step is changed
// maybe refer to how to write custom react hooks or use react reducers that update the state per action
// what are the exact differences between global state management and context providers? When is the perfect
// use case for a global state management library?

// TODO: read the best practices and most clean way to write Authentication UI
const Authenticator = () => {
  const handleChange = (evt: any, state: any, setState: React.Dispatch<any>) => setState({ ...state, [evt.target.name]: evt.target.value });
  // TODO: refactor the components, have to define all the components
  // inside this function because all components need to update the step state
  // can possibly refactor by defining route for each component
  const [step, setStep] = React.useState<AuthStep>('signin');
  const [emailToConfirm, setEmailToConfirm] = React.useState('');

  const SignUp = () => {
    const [signUpCredentials, setSignUpCredentials] = React.useState<UserCredentials>(INIT_CREDENTIALS);

    return step === 'signup' ? (
      <form
        style={{ margin: '20px' }}
        onSubmit={(e) => {
          e.preventDefault();
          signUp(signUpCredentials.email, signUpCredentials.password)
            .then((user) => {
              console.log('A new user is created');
              setEmailToConfirm(signUpCredentials.email);
              setStep('confirm-signup');
            })
            .catch((err) => alert(err.message));
        }}
      >
        <h3>Create a new account</h3>
        <div>
          <label>Email Address</label>
          <input
            style={{ display: 'block' }}
            name="email"
            value={signUpCredentials.email}
            onChange={(e) => handleChange(e, signUpCredentials, setSignUpCredentials)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            style={{ display: 'block' }}
            name="password"
            type="password"
            value={signUpCredentials.password}
            onChange={(e) => handleChange(e, signUpCredentials, setSignUpCredentials)}
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Have an account?{' '}
          <button type="submit" onClick={() => setStep('signin')}>
            Sign in
          </button>
        </p>
      </form>
    ) : (
      <ConfirmSignUp />
    );
  };

  const ConfirmSignUp = () => {
    const [code, setCode] = React.useState('');
    const handleChange = (e: any) => setCode(e.target.value);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          confirmSignUp(emailToConfirm, code);
        }}
      >
        <div>
          <label>Verification Code</label>
          <input name="verification_code" value={code} onChange={handleChange} />
        </div>
        {/* the user should be able to sign in after they verify themselves */}
        {/* TODO: redirect the user to the homepage after they are verified */}
        <button type="submit">Verify</button>
      </form>
    );
  };

  const SignIn = () => {
    const [signInCredentials, setSignInCredentials] = React.useState<UserCredentials>(INIT_CREDENTIALS);

    return step === 'signin' ? (
      <form
        style={{ margin: '20px' }}
        onSubmit={(e) => {
          e.preventDefault();
          signIn(signInCredentials.email, signInCredentials.password);
        }}
      >
        <h3>Sign in to your account</h3>
        <div>
          <label>Email Address</label>
          <input
            style={{ display: 'block' }}
            name="email"
            value={signInCredentials.email}
            onChange={(e) => handleChange(e, signInCredentials, setSignInCredentials)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            style={{ display: 'block' }}
            name="password"
            type="password"
            value={signInCredentials.password}
            onChange={(e) => handleChange(e, signInCredentials, setSignInCredentials)}
          />
          {/* TODO: define one more possible value to the state and define the reset password form */}
          <p>
            Forgot your password?
            <button type="button" onClick={() => {}}>
              Reset password
            </button>
          </p>
        </div>
        <button type="submit">Sign In</button>
        <p>
          No account?{' '}
          <button type="button" onClick={() => setStep('signup')}>
            Create account
          </button>
        </p>
        {/* Only resend the confirmation code when there is an error signing in, e.g. the user is not confirmed etc. */}
        <p>
          Resend confirmation code.{' '}
          <button
            type="button"
            onClick={async () => {
              resendConfirmationCode(signInCredentials.email)
                .then((_) => {
                  setEmailToConfirm(signInCredentials.email);
                  setStep('confirm-signup');
                })
                .catch((err) => alert(err.message));
            }}
          >
            Resend verification code
          </button>
        </p>
      </form>
    ) : step === 'confirm-signup' ? (
      <ConfirmSignUp />
    ) : (
      <div />
    );
  };

  const ForgotPasswordSendConfirmationCode = () => {};

  const ResetPasswordWithCode = () => {};

  return step === 'signin' ? <SignIn /> : <SignUp />;
};

export default Authenticator;
