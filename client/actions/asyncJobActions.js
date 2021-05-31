import Request from 'axios';
import syncActions from './syncActions';
import socketRequests from './socketRequests';
import config from '../config';

const ip = config.JOB_SERVER_PATH;
function makeRequest(method, api = '/login', data) {
  //   const failureResponse = [401, 404, 500];
  return Request[method](ip + api, data).then(r => r);
}
exports.getStatus = () => dispatch =>
  makeRequest('get', '/api/listener/status').then(resp =>
    dispatch(syncActions.gotListenerStatus(resp.data))
  );
exports.startListener = data => dispatch =>
  makeRequest('post', '/api/listener/start', data).then(resp =>
    socketRequests.getListenerStatus()
  );
exports.getBalances = data => dispatch =>
  makeRequest('get', '/api/listener/balances', data).then(resp =>
    dispatch({ type: 'GOT_WALLET_BALANCES', payload: resp.data })
  );
exports.stopListener = (currency = 'ALL') => dispatch =>
  makeRequest('put', `/api/listener/stop?currency=${currency}`).then(resp =>
    socketRequests.getListenerStatus()
  );
exports.updateListener = data => dispatch =>
  makeRequest('put', '/api/listener/update', data).then(resp =>
    socketRequests.getListenerStatus()
  );
exports.fetchTransaction = transactionId => dispatch =>
  makeRequest('get', `/api/transaction/${transactionId}`).then(resp =>
    dispatch({ type: 'GOT_JOB_TRANSACTION', payload: resp.data })
  );
exports.fetchAllTransactions = () => dispatch =>
  makeRequest('get', '/api/transactions').then(resp =>
    dispatch({ type: 'GOT_JOB_TRANSACTIONS', payload: resp.data })
  );

exports.fetchUser = userId => dispatch =>
  makeRequest('get', `/api/user/${userId}`).then(resp =>
    dispatch({ type: 'GOT_JOB_USER', payload: resp.data })
  );

exports.fetchAllUser = () => dispatch =>
  makeRequest('get', '/api/users').then(resp =>
    dispatch({ type: 'GOT_JOB_USERS', payload: resp.data })
  );
