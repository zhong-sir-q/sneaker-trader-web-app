import React from 'react';
import { v4 as uuidV4 } from 'uuid';

// pages
import SignIn from 'pages/SignIn';
import ForgotPassword from 'pages/ForgotPassword';
import UserProfile from 'pages/UserProfile';
import SneakerListingForm from 'pages/SneakerListingForm';
import MarketPlace from 'pages/MarketPlace';
import PrivacyPolicy from 'pages/PrivacyPolicy';
import Portfolio from 'pages/Portfolio';
import SignupForm from 'pages/SignUp';
import Terms from 'pages/Terms';

// components
import Dashboard from 'components/Dashboard';

// providers
import PreviewImgDropzoneProvider from 'providers/PreviewImgDropzoneProvider';
import SneakerListingFormProvider from 'providers/SneakerListingFormProvider';
import UserStatsProvider from 'providers/marketplace/UserStatsProvider';
import WalletProvider from 'providers/WalletProvider';
import GoogleOauth2ControllerInstance from 'api/controllers/external/GoogleOauth2Controller';
import SuperEditGallery from 'pages/dashboard/SuperEditGallery';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import AwsControllerInstance from 'api/controllers/AwsController';

// routes
export const AUTH = '/auth';
export const ADMIN = '/admin';
export const HOME = '/';

export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const FORGOT_PW = '/reset';

export const DASHBOARD = '/dashboard';
export const USER_PROFILE = '/profile';
export const PRODUCT_LISTING = '/product/listing';
export const PORTFOLIO = '/portfolio';

export const TERMS = '/terms';
export const PRIVACY_POLICY = '/policy';

// a random string so no user know about it
export const SUPER_USER_EDIT_GALLERY = '/' + uuidV4();

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
    path: PORTFOLIO,
    name: 'Portfolio',
    icon: 'now-ui-icons business_chart-pie-36',
    layout: ADMIN,
  },
  {
    path: SUPER_USER_EDIT_GALLERY,
    name: 'Edit Gallery Sneaker',
    icon: 'now-ui-icons business_bank',
    layout: ADMIN,
  },
];

export type HomeRoute = {
  path: string;
  layout: string;
  component: () => JSX.Element;
};

const DashboardWithProviders = (): JSX.Element => (
  <UserStatsProvider>
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  </UserStatsProvider>
);

const InjectedSignin = (): JSX.Element => <SignIn googleOauth2Controller={GoogleOauth2ControllerInstance} />;

const SneakerListingFormWithProviders = (): JSX.Element => (
  <SneakerListingFormProvider>
    <PreviewImgDropzoneProvider>
      <SneakerListingForm />
    </PreviewImgDropzoneProvider>
  </SneakerListingFormProvider>
);

const SudoEditGallery = (): JSX.Element => <SuperEditGallery sneakerController={SneakerControllerInstance} awsController={AwsControllerInstance} />

export const homeRoutes: HomeRoute[] = [
  {
    path: '/',
    component: MarketPlace,
    layout: HOME,
  },
  {
    path: PRIVACY_POLICY,
    component: PrivacyPolicy,
    layout: HOME,
  },
  {
    path: TERMS,
    component: Terms,
    layout: HOME,
  },
];

const routes: SneakerTraderRoute[] = [
  {
    path: SIGNUP,
    name: 'Signup',
    component: SignupForm,
    layout: AUTH,
  },
  {
    path: SIGNIN,
    name: 'Signin',
    component: InjectedSignin,
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
    component: DashboardWithProviders,
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
    component: SneakerListingFormWithProviders,
    layout: ADMIN,
  },
  {
    path: PORTFOLIO,
    name: 'Porfolio',
    component: Portfolio,
    layout: ADMIN,
  },
  {
    path: SUPER_USER_EDIT_GALLERY,
    name: 'Edit Gallery Sneaker',
    component: SudoEditGallery,
    layout: ADMIN,
  },
];

export default routes;
