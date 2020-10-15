import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import ForgotPassword from 'pages/ForgotPassword';
import UserProfile from 'pages/UserProfile';
import SneakerListingForm from 'pages/SneakerListingForm';

import Dashboard from 'components/Dashboard';
import MarketPlace from 'pages/MarketPlace';
import TopupWalletPage from 'pages/dashboard/TopupWalletPage';
import PrivacyPolicy from 'pages/PrivacyPolicy';

export const AUTH = '/auth';
export const ADMIN = '/admin';
export const HOME = '/';

export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const FORGOT_PW = '/reset';

export const DASHBOARD = '/dashboard';
export const USER_PROFILE = '/profile';
export const PRODUCT_LISTING = '/product/listing';
export const TOPUP_WALLET = '/topup';

export const PRIVACY_POLICY = '/policy';

type AppLayout = '/auth' | '/admin' | '/';

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

// And I have to put the route object in the routes variable first otherwise
// it will force redirect back to the dashbord as implemented in AdminLayout
export const sidebarRoutes = [
  {
    path: DASHBOARD,
    name: 'Dashboard',
    icon: 'now-ui-icons design_app',
    layout: ADMIN,
  },
  {
    path: PRODUCT_LISTING,
    name: 'Product Listing',
    icon: 'now-ui-icons objects_diamond',
    layout: ADMIN,
  },
  {
    path: TOPUP_WALLET,
    name: 'Topup Wallet',
    icon: 'now-ui-icons business_money-coins',
    layout: ADMIN,
  },
];

export type HomeRoute = {
  path: string;
  layout: string;
  component: () => JSX.Element;
};

export const homeRoutes: HomeRoute[] = [
  {
    path: '/',
    component: MarketPlace,
    layout: HOME
  },
  {
    path: PRIVACY_POLICY,
    component: PrivacyPolicy,
    layout: HOME
  },
];

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
  {
    path: USER_PROFILE,
    name: 'User Profile',
    component: UserProfile,
    layout: ADMIN,
  },
  {
    path: PRODUCT_LISTING,
    name: 'Product Listing',
    component: SneakerListingForm,
    layout: ADMIN,
  },
  {
    path: TOPUP_WALLET,
    name: 'Topup Wallet',
    component: TopupWalletPage,
    layout: ADMIN,
  },
];

export default routes;
