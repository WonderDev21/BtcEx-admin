import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.adminDash, action) => {
  switch (action.type) {
    case 'ITEM_SELECTED':
      return _.assign({}, state, { activeItem: action.payload });

    case 'USER_DOCUMENTS':
      return _.assign({}, state, { userDoc: action.payload });

    case 'GOT_ALL_USERS': {
      const stateData = {};
      if (action.offset === 0) {
        stateData.allUsers = action.payload;
        stateData.usersData = action.payload;
      } else {
        const newUsers = [...state.allUsers, ...action.payload];
        stateData.allUsers = newUsers;
        stateData.usersData = newUsers;
      }
      return _.assign({}, state, stateData);
    }

    case 'GOT_ALL_ORDERS':
      return _.assign({}, state, {
        allOrders: _.orderBy(action.payload, ['updatedAt'], ['desc']),
        ordersData: _.orderBy(action.payload, ['updatedAt'], ['desc']),
      });

    case 'GOT_ALL_ACCOUNTS': {
      const data = (action.payload || []).map(account =>
        _.assign({}, account, {
          updateBalance: '',
          updateMode: 'CREDIT',
          address: account.address,
        })
      );
      return _.assign({}, state, { allAccounts: data, accountsData: data });
    }
    case 'GOT_ALL_TRADES':
      return _.assign({}, state, {
        allTrades: _.orderBy(action.payload, ['updatedAt'], ['desc']),
        tradesData: _.orderBy(action.payload, ['updatedAt'], ['desc']),
      });

    case 'GOT_ALL_TRANSACTIONS':
      return _.assign({}, state, {
        allTransactions: _.orderBy(action.payload, ['updatedAt'], ['desc']),
        transactionsData: _.orderBy(action.payload, ['updatedAt'], ['desc']),
      });
    /* ---------------------- Socket update listener ---------------------------------------------------------------*/
    case 'GOT_NEW_ORDER':
      return _.assign({}, state, {
        allOrders: [action.payload.data, ...state.ordersData],
        ordersData: [action.payload.data, ...state.ordersData],
      });

    case 'GOT_TRADED_ORDER': {
      const order = action.order;
      const temp = state.ordersData.filter(x => x.orderId !== order.orderId);
      return _.assign({}, state, {
        allOrders: [order, ...temp],
        ordersData: [order, ...temp],
      });
    }
    case 'TRADE_UPDATE': {
      const newArr = action.payload.data;
      const oldArr = state.tradesData;
      return _.assign({}, state, {
        allTrades: [...newArr, ...oldArr],
        tradesData: [...newArr, ...oldArr],
      });
    }
    case 'CANCEL_USER_ORDER': {
      const o = action.payload.data;
      const arr = state.ordersData.filter(x => x.orderId !== o.orderId);
      return _.assign({}, state, {
        allOrders: [o, ...arr],
        ordersData: [o, ...arr],
      });
    }
    /* ---------------------- Socket update listener ---------------------------------------------------------------*/
    case 'FILTER_LIST': {
      const payload = action.payload;
      let filteredData;
      switch (state.activeItem) {
        case 'Users':
          switch (payload.searchBy) {
            case 'name':
              filteredData = !payload.text
                ? state.usersData
                : state.usersData.filter(x =>
                    _.includes(_.toLower(x.fullName), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allUsers: filteredData });
            case 'email':
              filteredData = !payload.text
                ? state.usersData
                : state.usersData.filter(x =>
                    _.includes(_.toLower(x.email), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allUsers: filteredData });
            case 'userId':
              filteredData = !payload.text
                ? state.usersData
                : state.usersData.filter(x =>
                    _.includes(_.toLower(x.userId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allUsers: filteredData });
            case 'kycVerified':
              filteredData = !payload.text
                ? state.usersData
                : state.usersData.filter(x =>
                    _.includes(
                      _.toLower(x.kycVerified),
                      _.toLower(payload.text)
                    )
                  );
              return _.assign({}, state, { allUsers: filteredData });
            default:
              return _.assign({}, state, { allUsers: state.usersData });
          }
        case 'Orders': {
          switch (payload.searchBy) {
            case 'orderId':
              filteredData = !payload.text
                ? state.ordersData
                : state.ordersData.filter(x =>
                    _.includes(_.toLower(x.orderId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allOrders: filteredData });
            case 'userId':
              filteredData = !payload.text
                ? state.ordersData
                : state.ordersData.filter(x =>
                    _.includes(_.toLower(x.userId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allOrders: filteredData });
            default:
              return _.assign({}, state, { allOrders: state.ordersData });
          }
        }
        case 'Accounts': {
          switch (payload.searchBy) {
            case 'objectId':
              filteredData = !payload.text
                ? state.accountsData
                : state.accountsData.filter(x =>
                    _.includes(_.toLower(x.id), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allAccounts: filteredData });
            case 'userId':
              filteredData = !payload.text
                ? state.accountsData
                : state.accountsData.filter(x =>
                    _.includes(_.toLower(x.userId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allAccounts: filteredData });
            default:
              return _.assign({}, state, { allAccounts: state.accountsData });
          }
        }
        case 'Trades': {
          switch (payload.searchBy) {
            case 'tradeId':
              filteredData = !payload.text
                ? state.tradesData
                : state.tradesData.filter(x =>
                    _.includes(_.toLower(x.tradeId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allTrades: filteredData });
            case 'buyerId':
              filteredData = !payload.text
                ? state.tradesData
                : state.tradesData.filter(x =>
                    _.includes(_.toLower(x.buyUserId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allTrades: filteredData });
            case 'sellerId':
              filteredData = !payload.text
                ? state.tradesData
                : state.tradesData.filter(x =>
                    _.includes(_.toLower(x.sellUserId), _.toLower(payload.text))
                  );
              return _.assign({}, state, { allTrades: filteredData });
            default:
              return _.assign({}, state, { allTrades: state.tradesData });
          }
        }
        default:
          return '';
      }
    }
    case 'GOT_ANNOUNCEMENT': {
      return _.assign({}, state, { announcement: action.payload });
    }
    default:
      return state;
  }
};
