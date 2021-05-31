import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import App from './components/App';
// import Dashboard from './components/Dashboard';
import adminContainer from './containers/adminContainer';
import LoginSignup from './containers/LoginSignup';
import UserContainer from './containers/UserContainer';
import NotificationContainer from './containers/NotificationContainer';
import AnnouncementContainer from './containers/AnnouncementContainer';
import TransactionContainer from './containers/TransactionContainer';
import TransactionJobContainer from './containers/TransactionJobContainer';
import RequestsContainer from './containers/RequestsContainer';
import AdminWrapper from './containers/AdminWrapper';

export default () => (
  <Route path="/" component={App}>
    <IndexRedirect to="login" />
    <Route path="login" component={LoginSignup} />
    <Route path="/admin" component={AdminWrapper}>
      <IndexRoute component={adminContainer} />
      {/* <Route path="users" component={UserContainer} />
      <Route path="notification" component={NotificationContainer} />
      <Route path="transactions" component={TransactionContainer} />
      <Route path="transactionJobs" component={TransactionJobContainer} />
      <Route path="announcement" component={AnnouncementContainer} />
      <Route path="requests" component={RequestsContainer} /> */}
    </Route>
  </Route>
);
