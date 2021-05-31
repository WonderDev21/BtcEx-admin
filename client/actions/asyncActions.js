import Request from 'axios';
import syncActions from './syncActions';
import { getURL } from '../utils';

function makeRequest(method, api = '/login', data) {
  //   const failureResponse = [401, 404, 500];
  const url = api.substr(0, 4) === 'http' ? api : `/api${api}`;
  return Request[method](url, data).then(r => r);
}

exports.login = data => dispatch => makeRequest('post', '/login', data);
// .then(response => dispatch(syncActions.updatedUserAccount(response.data)));
exports.signup = data => dispatch => makeRequest('post', '/register', data);
// .then(response => dispatch(syncActions.updatedUserAccount(response.data)));
exports.loginOTP = data => dispatch => makeRequest('post', '/loginOTP', data);

exports.fetchAllUsers = (data = {}) => dispatch => {
  const url = getURL(`/allusers`, data);
  console.log(url);
  return makeRequest('get', url).then(response =>
    dispatch(syncActions.gotAllUsers(response.data, data.offset))
  );
};

exports.fetchAllOrders = () => dispatch =>
  makeRequest('get', '/allorders').then(response =>
    dispatch(syncActions.gotAllOrders(response.data))
  );

exports.fetchAllAccounts = (data = {}) => dispatch => {
  const url = getURL(`/allaccounts`, data);
  console.log(url);
  return makeRequest('get', url).then(response =>
    dispatch(syncActions.gotAllAccounts(response.data))
  );
};

exports.fetchAllTrades = (data = {}) => dispatch => {
  const url = getURL(`/admin/alltrades`, data);
  console.log(url);
  return makeRequest('get', url).then(response =>
    dispatch(syncActions.gotAllTrades(response.data))
  );
};

exports.fetchAllTransactions = (data = {}) => dispatch => {
  const url = getURL(`/alltransactions`, data);
  console.log(url);
  return makeRequest('get', url).then(response => {
    dispatch({ type: 'GOT_SERVER_TRANSACTIONS', payload: response.data });
    return dispatch(syncActions.gotAllTransactions(response.data));
  });
};

exports.fetchTransaction = txnId => dispatch =>
  makeRequest('get', `/admin/transaction/${txnId}`).then(response =>
    dispatch({ type: 'GOT_SERVER_TRANSACTION', payload: response.data })
  );
exports.updateUser = data => dispatch =>
  makeRequest('put', '/admin/user/update', data);

exports.cretaVirtualAccount = data => dispatch =>
  makeRequest('post', '/ac/create-va', data);

// .then(response => dispatch(syncActions.updatedUser(response.data)));
exports.calcelOrder = orderId => dispatch =>
  makeRequest('delete', `/admin/order/cancel/${orderId}`);
// .then(response => dispatch(syncActions.updatedOrder(response.data)));
// exports.creditUserAccount = acc => dispatch => makeRequest('post', '/admin/user/creditBalance', acc);
// .then(response => dispatch(syncActions.updatedUserAccount(response.data)));
// exports.debitUserAccount = acc => dispatch => makeRequest('post', '/admin/user/debitBalance', acc);
// .then(response => dispatch(syncActions.updatedUserAccount(response.data)));

exports.getUserDocument = userId => dispatch =>
  makeRequest('get', `/document/user/${userId}`).then(response =>
    dispatch(syncActions.gotUserDocument(response.data))
  );

exports.transaction = transactionObject => dispatch =>
  makeRequest('post', '/admin/transaction/add', transactionObject);
exports.updateTransaction = transactionObject => dispatch =>
  makeRequest('put', '/admin/transaction/update', transactionObject);

exports.onRestartTrading = orders => dispatch =>
  makeRequest('post', '/admin/orders/restart', orders);

exports.getOrder = orderId => dispatch =>
  makeRequest('get', `/order/${orderId}`).then(response =>
    dispatch(syncActions.gotOrder(response.data))
  );

exports.getUserAccountStatement = userId => dispatch =>
  makeRequest('get', `/admin/accountStatement/${userId}`).then(resp =>
    dispatch(syncActions.gotAccountStatement(userId, resp.data))
  );

exports.getUserDetails = userId => dispatch =>
  makeRequest('get', '/admin/user').then(resp =>
    dispatch(syncActions.gotUserDetails(userId, resp.data))
  );

exports.publishAnnoucement = data => dispatch =>
  makeRequest('post', '/admin/announce', data);
exports.clearAnnouncement = () => dispatch =>
  makeRequest('delete', '/admin/announce');
exports.getAnnouncement = () => dispatch =>
  makeRequest('get', '/announcements').then(resp =>
    dispatch(syncActions.gotAnnouncement(resp.data))
  );
exports.getAllRequests = () => dispatch =>
  makeRequest('get', '/admin/requests').then(resp =>
    dispatch(syncActions.gotAllRequests(resp.data))
  );
exports.updateRequest = (requestId, data) => dispatch =>
  makeRequest('put', `/admin/request/${requestId}/update`, data).then(resp =>
    dispatch(exports.getAllRequests())
  );
exports.updateWalletAddress = data => dispatch =>
  makeRequest(
    'put',
    `/admin/account/${data.id}/address?currency=${data.currency}&type=${
      data.type
    }&key=${data.key}`,
    data
  );

exports.processINRWithdrawals = transactionId => dispatch =>
  makeRequest('post', `/admin/withdrawINR/${transactionId}/process`);
exports.processCoinWithdrawals = transactionId => dispatch =>
  makeRequest('post', `/admin/withdraw/${transactionId}/process`);

exports.processINRDeposits = data => dispatch =>
  makeRequest('post', '/job/depositINR', data);

exports.processCoinDeposits = data => dispatch =>
  makeRequest('post', '/job/deposit', data);
