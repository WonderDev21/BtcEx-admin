import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.wallets, action) => {
  switch (action.type) {
    case 'GOT_WALLET_BALANCES': {
      const { balances } = action.payload;
      const wallet = {};
      _.forEach(balances, ([currency, address, bal]) => {
        if (address.length === 42 && address.substring(0, 2) === '0x') {
          wallet[address.slice(2)] = { amount: bal, currency };
        } else {
          wallet[address] = { amount: bal, currency };
        }
      });
      return _.assign({}, state, wallet);
    }
    case 'GOT_WALLET_BALANCE': {
      const wallets = _.get(action, 'payload.value', []);
      const wallet = {};
      _.forEach(wallets, w => {
        const [currency, address, bal] = w;
        wallet[address] = { amount: bal, currency };
      });
      return _.assign({}, state, wallet);
    }
    default:
      return state;
  }
};
