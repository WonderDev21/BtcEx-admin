import _ from 'lodash';
import initialState from './initialState';
import { arrayToObject } from '../utils';

export default (state = initialState.userJobs, action) => {
  switch (action.type) {
    case 'GOT_JOB_USERS': {
      // notice S at the end
      return arrayToObject(action.payload, '_id');
    }
    case 'GOT_JOB_USER': {
      const t = action.payload;
      return _.assign({}, state, { [t._id]: t });
    }
    default:
      return state;
  }
};
