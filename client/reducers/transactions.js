import _ from 'lodash';
import initialState from './initialState';
import { arrayToObject } from '../utils';

export default (state = initialState.transactions, action) => {
  switch (action.type) {
    case 'GOT_SERVER_TRANSACTIONS': {
      // notice S at the end
      return arrayToObject(action.payload, 'transactionId');
    }
    case 'GOT_SERVER_TRANSACTION': {
      const t = action.payload;
      return _.assign({}, state, { [t.transactionId]: t });
    }
    default:
      return state;
  }
};
