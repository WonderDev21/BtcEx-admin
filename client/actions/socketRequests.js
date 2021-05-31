import channels from '../channels';

const { accountSocket } = channels;
/* Not Async Actions, do not use THUNKS */
exports.getListenerStatus = currency => {
  accountSocket.emit('listenerStatus', currency);
};
exports.fetchOrderBook = currency => {
  accountSocket.emit('orders', currency);
};
exports.fetchCoinBalance = currency => {
  accountSocket.emit('coin_balance', currency);
};
