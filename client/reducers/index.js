import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import adminReducer from './adminReducer';
import statements from './statements';
import requests from './requests';
import users from './users';
import app from './app';
import wallets from './wallets';
import transactions from './transactions';
import transactionJobs from './transactionJobs';
import userJobs from './userJobs';

const rootReducer = combineReducers({
  app,
  routing,
  adminReducer,
  statements,
  requests,
  users,
  wallets,
  transactions,
  transactionJobs,
  userJobs,
});

export default rootReducer;
