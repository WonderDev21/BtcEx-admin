import io from 'socket.io-client';
import config from './config';
/* eslint-disable camelcase */
// let socket_server = null;

const accountSocket = io(`${config.JOB_SERVER_PATH}/admin`);

 // io(`${location.protocol}//${location.host}`);

exports.accountSocket = accountSocket;
/* eslint-enable camelcase */
