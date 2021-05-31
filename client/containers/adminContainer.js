import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import numeral from 'numeral';
import { push } from 'react-router-redux';
import isJSON from 'validator/lib/isJSON';
import './adminContainer.scss';
import AdminDashboard from '../components/adminDashboard/adminDashboard';
import Users from '../components/adminDashboard/usersComponent';
import Orders from '../components/adminDashboard/orderComponent';
import Accounts from '../components/adminDashboard/accountComponent';
import Trades from '../components/adminDashboard/tradeComponent';
import Transactions from '../components/adminDashboard/transactionComponent';
import UserContainer from './UserContainer';
import NotificationContainer from './NotificationContainer';
import AnnouncementContainer from './AnnouncementContainer';
import CoinDeposits from './CoinDeposits';
import RequestsContainer from './RequestsContainer';
import asyncActions from '../actions/asyncActions';
import asyncJobActions from '../actions/asyncJobActions';
import syncActions from '../actions/syncActions';

class AdminContainer extends Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      searchBy: '',
      editObj: {},
      selectedOrders: [],
      server: { ETH: 0 },
      userDoc: {},
      bankKey: 0,
      isModalOpen: false,
      data: {
        customerId: '',
        currency: '',
        amount: '',
        address: '',
      },
      updateLoader: false,
      selectedFilter: '',
      filterLoader: false,
      filterValue: '',
    };
    this.handleSelectFilter = this.handleSelectFilter.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
    this.handleAccountSearch = this.handleAccountSearch.bind(this);
    this.handleTransactionSearch = this.handleTransactionSearch.bind(this);
    this.handleTradeSearch = this.handleTradeSearch.bind(this);
    // this.handleTransactionSelectFilter = this.handleTransactionSelectFilter.bind(
    //   this
    // );
    // this.handleTransactionSearch = this.handleTransactionSearch.bind(this);
    // this.handleTransactionInputChange = this.handleTransactionInputChange.bind(
    //   this
    // );
  }

  componentDidMount() {
    Promise.all([
      this.props.dispatch(asyncJobActions.getBalances()),
      this.props.dispatch(asyncActions.fetchAllUsers()),
      this.props.dispatch(asyncActions.fetchAllOrders()),
      this.props.dispatch(asyncActions.fetchAllAccounts()),
      this.props.dispatch(asyncActions.fetchAllTrades()),
      this.props.dispatch(asyncActions.fetchAllTransactions()),
    ])
      .then(() => {
        this.setState({ server: this.serverBalance() });
      })
      .catch(console.log);
  }

  onCheckOrder(orderDetails) {
    // let that = this;
    let orderArr = this.state.selectedOrders;
    // console.log('OnCheck Before: ', orderArr);
    orderArr = _.concat(orderArr, orderDetails);
    // console.log('Add: ',orderArr);
    that.setState({ selectedOrders: orderArr });
    // console.log('After: ', this.state.selectedOrders);
  }

  onUnCheckOrder(orderDetails) {
    // let that = this;
    let orderArr = this.state.selectedOrders;
    // console.log('OnUnCheck Before: ', orderArr);
    orderArr = _.filter(
      orderArr,
      order => order.orderId !== orderDetails.orderId
    );
    // console.log('Filter: ',orderArr);
    that.setState({ selectedOrders: orderArr });
    // console.log('After: ', this.state.selectedOrders);
  }

  onRestart() {
    console.log('Selected Orders', this.state.selectedOrders);
    this.props
      .dispatch(
        asyncActions.onRestartTrading({ orders: this.state.selectedOrders })
      )
      .then(response => {
        console.log('Order restart Trading Sucessfull: ', response);
        this.setState({ selectedOrders: [] });
        this.props.dispatch(asyncActions.fetchAllOrders());
      });
  }

  serverBalance() {
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

  onSave(active) {
    const obj = this.state.editObj;
    if (active === 'Users') {
      this.props.dispatch(asyncActions.updateUser(obj)).then(response => {
        console.log('User Updated: ', response);
        this.setState({ editObj: {} });
      });
    } else if (active === 'Orders') {
      if (obj.status === 'CANCELLED') {
        console.log('cancell Order');
        this.props
          .dispatch(asyncActions.calcelOrder(obj.orderId))
          .then(response => {
            console.log('Order Cancelled: ', response);
            this.setState({ editObj: {} });
          });
      } else {
        console.log('Nothig to Save in Order:');
        this.setState({ editObj: {} });
      }
    } else if (active === 'Accounts') {
      if (obj.updateBalance && obj.updateBalance > 0) {
        console.log('Account Object: ', obj);
        const transactionObject = {
          mode: 'OTHERS',
          currency: obj.currency,
          address: obj.address ? obj.address : 'NA',
          amount: obj.updateBalance,
          type:
            obj.updateMode === 'DEBIT'
              ? 'WITHDRAW_FROM_PLATFORM'
              : 'ADD_TO_PLATFORM',
          userId: obj.userId,
          customerId: obj.userId,
        };
        this.props
          .dispatch(asyncActions.transaction(transactionObject))
          .then(response => {
            console.log('Transaction: ', response);
            Promise.all([
              this.props.dispatch(asyncActions.fetchAllAccounts()),
              this.props.dispatch(asyncActions.fetchAllTransactions()),
            ]).then(resp => {
              console.log('Sucess add new transaction: ');
              this.setState({ editObj: {} });
            });
          });
      } else {
        this.setState({ editObj: {} });
      }
    } else if (active === 'Transactions') {
      let txnInfo = obj.transactionInfo;
      if (typeof obj.transactionInfo === 'string') {
        txnInfo = isJSON(obj.transactionInfo)
          ? JSON.parse(obj.transactionInfo)
          : obj.transactionInfo;
      }
      obj.transactionInfo = txnInfo;
      this.props
        .dispatch(asyncActions.updateTransaction(obj))
        .then(response => {
          console.log('Transaction updated: ', response);
          Promise.all([
            this.props.dispatch(asyncActions.fetchAllAccounts()),
            this.props.dispatch(asyncActions.fetchAllTransactions()),
          ]).then(resp => {
            console.log('Sucess update: ');
            this.setState({ editObj: {} });
          });
        });
    }
  }
  getNewAddress(account) {
    const that = this;
    that.props
      .dispatch(asyncActions.updateWalletAddress(account))
      .then(resp => {
        that.setState({ editObj: _.assign({}, that.state.editObj, resp.data) });
      });
  }
  handleEdit(obj) {
    console.log('Object: ', obj);
    this.setState({ editObj: obj });
  }
  handleBack() {
    this.setState({ editObj: {} });
  }
  onTransXAmtChange(field, e) {
    const { customerId, currency, address } = this.state.data;
    this.setState({
      data: { amount: e.target.value, currency, address, customerId },
    });
  }
  onChangeEdit(field, value) {
    const that = this;
    console.log(field, ':', value);
    that.setState({
      editObj: _.assign({}, that.state.editObj, { [field]: value }),
    });
  }
  onChange(value) {
    this.setState({ searchText: value });
  }
  handleSearch() {
    const active = this.props.admin.activeItem;
    const text = _.trim(this.state.searchText);
    const searchBy = this.state.searchBy;
    if (active) {
      this.props.dispatch(syncActions.filterList({ searchBy, text }));
    }
  }
  handleEnter(event) {
    if (event.charCode === 13) {
      const searchBy = this.state.searchBy;
      const text = _.trim(this.state.searchText);
      this.props.dispatch(syncActions.filterList({ searchBy, text }));
    }
  }
  searchBySelectedItem(e) {
    this.setState({ searchBy: e.target.value });
  }
  onSelectItem(item) {
    this.setState({ editObj: {} });
    this.props.dispatch(syncActions.showActiveItem(item));
  }
  getUser(userid) {
    if (this.state.userDoc.userId === userid) this.setState({ userDoc: {} });
    else {
      this.props
        .dispatch(asyncActions.getUserDocument(userid))
        .then(() => this.setState({ userDoc: this.props.admin.userDoc }));
    }
  }
  closeDoc() {
    this.setState({ userDoc: {} });
  }
  changeBank(key) {
    this.setState({ bankKey: key });
  }
  openModal(ele) {
    this.setState({ data: ele, isModalOpen: true });
  }
  closeModal() {
    this.setState({ isModalOpen: false });
  }

  handleSelectFilter(event, selectedValue) {
    this.setState({ selectedFilter: selectedValue.value });
  }

  handleAccountSearch() {
    const { selectedFilter, offset, filterValue } = this.state;
    const data = {
      [selectedFilter]: filterValue || null,
      offset: 0,
    };
    this.props.dispatch(asyncActions.fetchAllAccounts(data));
  }

  handleTransactionSearch() {
    const { selectedFilter, offset, filterValue } = this.state;
    const data = {
      [selectedFilter]: filterValue || null,
      offset: 0,
    };
    this.props.dispatch(asyncActions.fetchAllTransactions(data));
  }

  handleTradeSearch() {
    const { selectedFilter, offset, filterValue } = this.state;
    const data = {
      [selectedFilter]: filterValue || null,
      offset: 0,
    };
    this.props.dispatch(asyncActions.fetchAllTrades(data));
  }

  handleInputChange(event) {
    const { value } = event.target;
    let { filterValue } = this.state;
    filterValue = value;
    this.setState({ filterValue });
  }

  handleResetFilter() {
    this.setState({ filterValue: '', selectedFilter: '' });
  }

  // handleTransactionSelectFilter(event, selectedValue) {
  //   this.setState({ selectedFilter: selectedValue.value });
  // }

  // handleTransactionSearch() {
  //   const { selectedFilter, offset, filterValue } = this.state;
  //   const data = {
  //     [selectedFilter]: filterValue || null,
  //     offset: 0,
  //   };
  //   this.props.dispatch(asyncActions.fetchAllUsers(data));
  // }

  // handleTransactionInputChange(event) {
  //   const { value } = event.target;
  //   let { filterValue } = this.state;
  //   filterValue = value;
  //   this.setState({ filterValue });
  // }

  main() {
    const that = this;
    switch (that.props.admin.activeItem) {
      case 'Users':
        return (
          <Users
            admin={that.props.admin}
            onChange={that.onChange.bind(that)}
            search={that.state.searchText}
            onEnter={that.handleEnter.bind(that)}
            onSelect={that.searchBySelectedItem.bind(that)}
            handleSearch={that.handleSearch.bind(that)}
            handleEdit={that.handleEdit.bind(that)}
            editObject={that.state.editObj}
            handleBack={that.handleBack.bind(that)}
            onChangeEdit={that.onChangeEdit.bind(that)}
            onSave={that.onSave.bind(that)}
            getUser={that.getUser.bind(that)}
            userDoc={that.state.userDoc}
            closeUserDoc={that.closeDoc.bind(that)}
            changeBank={that.changeBank.bind(that)}
            bankKey={that.state.bankKey}
          />
        );
      case 'Orders':
        return (
          <Orders
            admin={that.props.admin}
            onChange={that.onChange.bind(that)}
            search={that.state.searchText}
            onEnter={that.handleEnter.bind(that)}
            onSelect={that.searchBySelectedItem.bind(that)}
            handleSearch={that.handleSearch.bind(that)}
            handleEdit={that.handleEdit.bind(that)}
            editObject={that.state.editObj}
            handleBack={that.handleBack.bind(that)}
            onChangeEdit={that.onChangeEdit.bind(that)}
            onSave={that.onSave.bind(that)}
            onCheckOrder={that.onCheckOrder.bind(that)}
            onUnCheckOrder={that.onUnCheckOrder.bind(that)}
            onRestart={that.onRestart.bind(that)}
          />
        );
      case 'Accounts':
        return (
          <Accounts
            admin={that.props.admin}
            getNewAddress={that.getNewAddress.bind(that)}
            onChange={that.onChange.bind(that)}
            search={that.state.searchText}
            onEnter={that.handleEnter.bind(that)}
            onSelect={that.searchBySelectedItem.bind(that)}
            handleSearch={that.handleSearch.bind(that)}
            handleEdit={that.handleEdit.bind(that)}
            editObject={that.state.editObj}
            handleBack={that.handleBack.bind(that)}
            onChangeEdit={that.onChangeEdit.bind(that)}
            onSave={that.onSave.bind(that)}
            handleSelectFilter={this.handleSelectFilter}
            handleAccountSearch={this.handleAccountSearch}
            handleInputChange={this.handleInputChange}
            selectedFilter={this.state.selectedFilter}
            filterValue={this.state.filterValue}
            handleResetFilter={this.handleResetFilter}
          />
        );
      case 'Trades':
        return (
          <Trades
            admin={that.props.admin}
            onChange={that.onChange.bind(that)}
            search={that.state.searchText}
            onEnter={that.handleEnter.bind(that)}
            onSelect={that.searchBySelectedItem.bind(that)}
            handleSearch={that.handleSearch.bind(that)}
            handleTradeSearch={this.handleTradeSearch}
            handleSelectFilter={this.handleSelectFilter}
            handleInputChange={this.handleInputChange}
            selectedFilter={this.state.selectedFilter}
            filterValue={this.state.filterValue}
            handleResetFilter={this.handleResetFilter}
          />
        );
      case 'Transactions':
        return (
          <Transactions
            admin={that.props.admin}
            onChange={that.onChange.bind(that)}
            onEnter={that.handleEnter.bind(that)}
            onSelect={that.searchBySelectedItem.bind(that)}
            handleSearch={that.handleSearch.bind(that)}
            handleEdit={that.handleEdit.bind(that)}
            editObject={that.state.editObj}
            onChangeEdit={that.onChangeEdit.bind(that)}
            handleBack={that.handleBack.bind(that)}
            onSave={that.onSave.bind(that)}
            state={that.state}
            onTransXAmtChange={that.onTransXAmtChange.bind(that)}
            handleSelectFilter={this.handleSelectFilter}
            handleTransactionSearch={this.handleTransactionSearch}
            handleInputChange={this.handleInputChange}
            selectedFilter={this.state.selectedFilter}
            filterValue={this.state.filterValue}
            handleResetFilter={this.handleResetFilter}
          />
        );
      case 'AllUser':
        return (
          <UserContainer users={_.get(that.props, 'admin.allUsers', [])} />
        );
      case 'Notification':
        return (
          <NotificationContainer
            users={_.get(that.props, 'admin.allUsers', [])}
          />
        );
      case 'Announcement':
        return (
          <AnnouncementContainer
            users={_.get(that.props, 'admin.allUsers', [])}
          />
        );
      case 'Requests':
        return (
          <RequestsContainer users={_.get(that.props, 'admin.allUsers', [])} />
        );
      case 'Coin Deposits':
        return (
          <CoinDeposits
            accounts={_.get(that.props, 'admin.allAccounts', [])}
            users={_.get(that.props, 'admin.allUsers', [])}
          />
        );
      default:
        return <h1 className="elegant">Choose option from left SideBar</h1>;
    }
  }
  render() {
    const that = this;
    console.log('change render');
    return (
      <div className="admin-wrapper">
        <div className="data">{that.main()}</div>
      </div>
    );
  }
}
AdminContainer.defaultProps = {
  admin: {},
  dispatch: () => {},
};
AdminContainer.propTypes = {
  admin: PropTypes.object,
  dispatch: PropTypes.func,
};
const select = state => ({ admin: state.adminReducer });
export default connect(select)(AdminContainer);

// https://dribbble.com/shots/1445036-Software-Dashboard
// https://dribbble.com/shots/1262636-To-Do-Dashboard
// https://dribbble.com/shots/1740688-Product-Dashboard-Activity-Feed-UI-UX

// optimization
// onchange method(2), save and back button in each one can be removed
// send whole state as one obj
