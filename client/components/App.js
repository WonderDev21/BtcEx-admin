import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import syncActions from '../actions/syncActions';
import socketActions from '../actions/socketActions';
import asyncActions from '../actions/asyncActions';
import config from '../config';

const socket = io(config.BACKEND_SERVER_PATH);

class App extends Component {
  componentDidMount() {
    this.props.dispatch(socketActions.listenToServer());
    socket.on('connect', () => {
      console.log('Connected!');
    });
    socket.on('TRADE', sock => {
      switch (sock.type) {
        case 'GOT_NEW_ORDER':
          this.props.dispatch(syncActions.gotNewNotification(sock));
          this.notifyMe('New order has been placed');
          break;
        case 'TRADE_UPDATE':
          this.props.dispatch(syncActions.gotNewNotification(sock));
          sock.data.forEach(t => {
            const buyOrderId = t.buyOrderId;
            const sellOrderId = t.sellOrderId;
            this.props.dispatch(asyncActions.getOrder(buyOrderId));
            this.props.dispatch(asyncActions.getOrder(sellOrderId));
          });
          this.notifyMe('New trade happened');
          break;
        case 'CANCEL_USER_ORDER':
          this.props.dispatch(syncActions.gotNewNotification(sock));
          this.notifyMe('Some Order has been cancelled');
          break;
        default:
          break;
      }
    });
  }
  notifyMe(msg) {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      const notification = new Notification(msg);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          const notification = new Notification(msg);
        }
      });
    }
  }
  render() {
    const { location } = this.props;
    return <div>{this.props.children}</div>;
  }
}
App.propTypes = {
  children: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const select = state => ({ admin: state.adminReducer });
export default connect(select)(App);
