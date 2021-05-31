import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.app, action) => {
  switch (action.type) {
    case 'WALLET_LISTENER':
      return _.assign({}, state, { listenerStatus: _.get(action, 'payload.status', {}) });
    default:
      return state;
  }
};
