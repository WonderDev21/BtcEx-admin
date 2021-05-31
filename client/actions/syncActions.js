exports.gotAdminDashboard = payload => ({ type: 'DATA_RECEIVED', payload });

exports.showActiveItem = payload => ({ type: 'ITEM_SELECTED', payload });
exports.gotAllUsers = (resp, offset) => ({
  type: 'GOT_ALL_USERS',
  payload: resp,
  offset,
});
exports.gotAllOrders = payload => ({ type: 'GOT_ALL_ORDERS', payload });
exports.gotAllAccounts = payload => ({ type: 'GOT_ALL_ACCOUNTS', payload });
exports.gotAllTrades = payload => ({ type: 'GOT_ALL_TRADES', payload });
exports.gotAllTransactions = payload => ({
  type: 'GOT_ALL_TRANSACTIONS',
  payload,
});

exports.filterList = payload => ({ type: 'FILTER_LIST', payload });

exports.updatedUser = payload => ({ type: 'UPDATED_USER', payload });
exports.updatedOrder = payload => ({ type: 'UPDATED_ORDER', payload });
exports.updatedUserAccount = payload => ({
  type: 'UPDATED_USER_ACCOUNT',
  payload,
});

exports.gotUserDocument = payload => ({ type: 'USER_DOCUMENTS', payload });

exports.gotNewNotification = payload => ({ type: payload.type, payload });
exports.gotOrder = order => ({ type: 'GOT_TRADED_ORDER', order });
exports.gotAnnouncement = payload => ({ type: 'GOT_ANNOUNCEMENT', payload });

exports.gotUserDetails = (userId, userDetails) => ({
  type: 'GOT_USER_DETAILS',
  payload: { userId, userDetails },
});
exports.gotAccountStatement = (userId, statements) => ({
  type: 'GOT_ACCOUNT_STATEMENT',
  payload: { userId, statements },
});

exports.gotAllRequests = payload => ({ type: 'GOT_DEPOSIT_REQUESTS', payload });

exports.gotListenerStatus = payload => ({ type: 'WALLET_LISTENER', payload });

exports.gotWalletBalance = payload => ({ type: 'GOT_WALLET_BALANCE', payload });
