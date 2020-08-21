import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';

export const AUTH = '/auth';
export const ADMIN = '/admin';
export const SIGNIN = '/signin'
export const SIGNUP = '/signup'

export type SneakerTraderRoute = {
  path: string
  name: string
  component: () => JSX.Element,
  layout: '/auth' | '/admin'
}

const routes: SneakerTraderRoute[] = [
  {
    path: SIGNUP,
    name: 'Signup',
    component: SignUp,
    layout: AUTH,
  },
  {
    path: SIGNIN,
    name: 'Signin',
    component: SignIn,
    layout: AUTH,
  },
];

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/' : 'production_base_url_goes_here';
export default routes;
