import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.requests, action) => {
  switch (action.type) {
    case 'GOT_DEPOSIT_REQUESTS':
      return action.payload;
    default:
      return state;
  }
};
