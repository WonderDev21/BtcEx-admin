import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.statements, action) => {
  switch (action.type) {
    case 'GOT_ACCOUNT_STATEMENT': {
      const userId = action.payload.userId;
      return _.assign({}, state, { [userId]: action.payload.statements });
    }
    default:
      return state;
  }
};
