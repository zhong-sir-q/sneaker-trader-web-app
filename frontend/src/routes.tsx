import React from 'react';

import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import ForgotPassword from 'pages/ForgotPassword';
import UserProfile from 'pages/UserProfile';
import SneakerListingForm from 'pages/SneakerListingForm';

import Dashboard from 'components/Dashboard';
import HomePage from 'pages/HomePage';
import SneakerListingFormCtxProvider from 'providers/SneakerListingFormCtxProvider';
import PreviewImgDropzoneCtxProvider from 'providers/PreviewImgDropzoneCtxProvider';
import TopupWalletPage from 'pages/dashboard/TopupWalletPage';
import WalletCtxProvider from 'providers/WalletCtxProvider';

export const AUTH = '/auth';
export const ADMIN = '/admin';
export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const DASHBOARD = '/dashboard';
export const FORGOT_PW = '/reset';
export const USER_PROFILE = '/profile';
export const PRODUCT_LISTING = '/product/listing';
export const HOME = '/';
const TOPUP_WALLET = '/topup';

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

// NOTE: sidebarRoutes and homeRoutes contain duplicate
// routes, currenty this is a dirty solution

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
  component: () => JSX.Element;
};

export const homeRoutes: HomeRoute[] = [
  {
    path: HOME,
    component: HomePage,
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
    component: () => (
      <SneakerListingFormCtxProvider>
        <PreviewImgDropzoneCtxProvider>
          <SneakerListingForm />
        </PreviewImgDropzoneCtxProvider>
      </SneakerListingFormCtxProvider>
    ),
    layout: ADMIN,
  },
  {
    path: TOPUP_WALLET,
    name: 'Topup Wallet',
    component: () => (
      <WalletCtxProvider>
        <TopupWalletPage />
      </WalletCtxProvider>
    ),
    layout: ADMIN,
  },
];

export default routes;
