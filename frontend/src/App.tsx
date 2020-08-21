import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Layout from 'components/Layout';
import Profile from 'components/Profile';
import Products from 'components/Products';
import NewProductForm from 'components/NewProductForm';
import AmplifyAuthApp from 'components/auth/AmplifyAuthApp';

import SignIn from 'pages/SignIn';

import AuthStateProvider from 'providers/AuthStateProvider';

// @ts-ignore
import awsconfig from 'aws-exports';

import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';
import 'css/global.css';
import AuthLayout from 'layouts/AuthLayout';
import SignUp from 'pages/SignUp';
import { AUTH, SIGNIN } from 'routes';

Amplify.configure(awsconfig);

// const App = () => {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/">
//           <AuthStateProvider>
//             <AuthLayout>
//               <Route path="/signup">
//                 <SignUp />
//               </Route>
//               <SignIn />
//             </AuthLayout>
//             {/* <Layout>
//               <Profile />
//               <AmplifyAuthApp />
//               <NewProductForm />
//               <Products />
//             </Layout> */}
//           </AuthStateProvider>
//         </Route>
//       </Switch>
//     </Router>
//   );
// };

const App = () => <Router>
  <Switch>
    <Route path={AUTH}>
      <AuthLayout />
    </Route>
    <Redirect to={`${AUTH}${SIGNIN}`} />
  </Switch>
</Router>

export default App;
