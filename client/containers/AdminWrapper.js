import React, { Component } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import AdminDashboard from '../components/adminDashboard/adminDashboard';
import syncActions from '../actions/syncActions';
import './AdminWrapper.scss';

class AdminWrapper extends Component {
  onSelectItem(item) {
    this.setState({ editObj: {} });
    this.props.dispatch(syncActions.showActiveItem(item));
  }
  getServerBalance() {
    const server = { ETH: 0, INR: 0 };
    const orders = this.props.admin.allOrders;
    const trades = this.props.admin.allTrades;
    (orders || []).forEach(order => {
      if (order.side === 'SELL' && order.status === 'PENDING') {
        if (!server[order.currency]) {
          server[order.currency] = 0;
        }
        server[order.currency] = numeral(server[order.currency])
          .add(order.currentSize)
          .value();
      } else if (order.side === 'BUY' && order.status === 'PENDING') {
        server.INR =
          order.currentSize > 0
            ? numeral(server.INR)
                .add(
                  numeral(order.price)
                    .multiply(order.currentSize)
                    .value()
                )
                .add(
                  numeral(order.price)
                    .multiply(0.005)
                    .multiply(order.currentSize)
                    .value()
                )
                .value()
            : server.INR;
      }
    });
    (trades || []).forEach(trade => {
      server.INR = numeral(server.INR)
        .add(
          numeral(trade.price)
            .multiply(trade.size)
            .multiply(0.005)
            .multiply(2)
            .value()
        )
        .value();
    });
    return server;
  }
  render() {
    return (
      <div className="AdminWrapper">
        <div className="sidebar">
          <AdminDashboard
            admin={this.props.admin}
            onSelectItem={this.onSelectItem.bind(this)}
            server={this.getServerBalance()}
          />
        </div>
        {this.props.children}
      </div>
    );
  }
}
export default connect(s => ({ admin: s.adminReducer }))(AdminWrapper);
