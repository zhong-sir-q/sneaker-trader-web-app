import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import Dashboard from 'components/Dashboard';
import ForgotPassword from 'pages/ForgotPassword';

export const AUTH = '/auth';
export const ADMIN = '/admin';
export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const DASHBOARD = '/dashboard';
export const FORGOT_PW = '/reset';

type AppLayout = '/auth' | '/admin';

export type RouteState = 'openPages' | 'openComponents' | 'openForms' | 'openTables' | 'openMaps';

export type View =
  | {
      path: string;
      name: string;
      mini: string;
      component: () => JSX.Element;
      layout: AppLayout;
      short?: undefined;
    }
  | {
      path: string;
      name: string;
      short: string;
      mini: string;
      component: () => JSX.Element;
      layout: AppLayout;
    };

export type SneakerTraderRoute =
  | {
      collapse: boolean;
      path: string;
      name: string;
      state: RouteState;
      icon: string;
      views: View[];
      component?: undefined;
      layout?: undefined;
    }
  | {
      path: string;
      name: string;
      component: () => JSX.Element;
      layout: AppLayout;
      icon?: string;
      collapse?: undefined;
      state?: undefined;
      views?: undefined;
    };

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
  {
    path: FORGOT_PW,
    name: 'Forgot Password',
    component: ForgotPassword,
    layout: AUTH,
  },
  {
    path: DASHBOARD,
    name: 'Dashboard',
    icon: 'now-ui-icons design_app',
    component: Dashboard,
    layout: ADMIN,
  },
];

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/' : process.env.REACT_APP_API_BASE_URL as string;
export default routes;
