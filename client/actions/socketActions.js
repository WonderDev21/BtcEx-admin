import _ from 'lodash';
import syncActions from './syncActions';
import channels from '../channels';
import socketRequests from './socketRequests';

const { accountSocket } = channels; // eslint-disable-line camelcase

exports.listenToServer = () => (dispatch, getState) => {
  const { auth, app } = getState();
  const currency = _.get(app, 'currentMarket.symbol', null);
  accountSocket.on('connect', () => {
    socketRequests.getListenerStatus();

    socketRequests.fetchCoinBalance('ETH');
    socketRequests.fetchCoinBalance('MIOTA');
    console.log('Connected......');
  });
  accountSocket.on('COIN_ACCOUNTS', response => {
    dispatch(syncActions.gotWalletBalance(response));
    console.log('Notification:', response);
  });
  accountSocket.on('listenerStatus', response => {
    dispatch(syncActions.gotListenerStatus({ status: response }));
    // console.log('Listener status', response);
  });
  accountSocket.on('coin_balance', response => {
    dispatch(syncActions.gotWalletBalance(response));
    console.log('Coin balance', response);
  });
  accountSocket.on('disconnect', resp => {
    console.log('disconnected..', resp);
  });
};
exports.listenToTicker = () => dispatch => {};
