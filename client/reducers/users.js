import _ from 'lodash';
import initialState from './initialState';

export default (state = initialState.users, action) => {
  switch (action.type) {
    case 'GOT_USER_DETAILS': {
      const userId = action.payload.userId;
      return _.assign({}, state, { [userId]: action.payload });
    }
    default:
      return state;
  }
};
