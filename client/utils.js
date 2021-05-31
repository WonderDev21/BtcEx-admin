exports.arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item; // eslint-disable-line no-param-reassign
    return obj;
  }, {});

const escapeAmpersand = value =>
  typeof value === 'string' ? value.replace(/&/g, '%26') : value;

/**
 * @description Method to stringify URL and hashamp for GET API use
 * @param {string} URL to hit
 * @param {object} object which contains key and value to be stringified
 * @example getURL('/dummy/url?',{key=value,key1=value1}), URL may contain predefined parameters (someParam=someValue), question mark is optional.
 * @return returns a string like '/fetch/survey/images?key=value&key1=value1'
 */

exports.getURL = (url, hashmap) => {
  let str = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const key in hashmap) {
    if (hashmap[key] != null) {
      str += `${key}=${escapeAmpersand(hashmap[key])}&`;
    }
  }
  if (url.indexOf('?') === -1 && url.indexOf('=') === -1) {
    str = `${url}?${str.substr(0, str.length - 1)}`;
  } else if (url.indexOf('?') > -1 && url.indexOf('=') === -1) {
    str = url + str.substr(0, str.length - 1);
  } else if (url.indexOf('?') === -1 && url.indexOf('=') > -1) {
    str = `${url}?&${str.substr(0, str.length - 1)}`;
  } else if (url.indexOf('?') > -1 && url.indexOf('=') > -1) {
    str = `${url}&${str.substr(0, str.length - 1)}`;
  } else if (
    url.indexOf('?') > -1 &&
    url.indexOf('=') > -1 &&
    url.indexOf('&') > -1
  ) {
    str = url + str.substr(0, str.length - 1);
  }
  return str;
};
