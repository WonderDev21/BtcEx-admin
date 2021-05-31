import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
// import { Controlled as CodeMirror } from 'react-codemirror2';
import AppConstants from '../constants/AppConstants';
import asyncActions from '../actions/asyncActions';
import asyncJobActions from '../actions/asyncJobActions';
import INRTransaction from '../components/Withdrawal/INRTransaction';
import CoinTransaction from '../components/Withdrawal/CoinTransaction';

class TransactionJobContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txnObj: null,
    };
    this.onCancel = this.onCancel.bind(this);
    this.onProcessTransaction = this.onProcessTransaction.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(asyncJobActions.fetchAllTransactions());
  }
  handleStatusChange(e, f) {
    this.setState({
      txnObj: _.assign({}, this.state.txnObj, { status: f.value }),
    });
  }
  handleEdit(ele) {
    this.setState({ txnObj: ele });
  }
  onProcessTransaction(txn) {
    console.log('TRX', txn);
    /*
    if (txn.type === 'DEPOSIT') {
      // wrong
      if (txn.currency === 'INR') {
        this.props.dispatch(asyncActions.processINRDeposits(txn));
      } else {
        this.props.dispatch(asyncActions.processCoinDeposits(txn));
      }
    } else if (txn.type === 'WITHDRAW') {
      if (txn.currency === 'INR') {
        this.props.dispatch(asyncActions.processINRWithdrawals(txn));
      } else {
        this.props.dispatch(asyncActions.processCoinWithdrawals(txn));
      }
    }
    */
  }
  onCancel() {
    this.setState({ txnObj: null });
  }
  render() {
    const that = this;
    const { transactions } = that.props;
    const { txnObj } = that.state;
    return (
      <div style={{ padding: '0.5em', marginTop: '2em' }}>
        {txnObj ? (
          <div>
            {txnObj.currency === AppConstants.baseCurrency ? (
              <INRTransaction
                onProcess={this.onProcessTransaction}
                onCancel={this.onCancel}
                txnObj={txnObj}
              />
            ) : (
              <CoinTransaction
                onProcess={this.onProcessTransaction}
                onCancel={this.onCancel}
                txnObj={txnObj}
              />
            )}
          </div>
        ) : (
          <Table compact size="small" striped fixed celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">UserId</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Currency</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Amt</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  updatedAt
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">txnRef</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(transactions, (ele, key) => (
                <Table.Row key={key}>
                  <Table.Cell>{ele.userId}</Table.Cell>
                  <Table.Cell>{ele.email}</Table.Cell>
                  <Table.Cell>{ele.name}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.currency}</Table.Cell>
                  <Table.Cell textAlign="right">{ele.amount}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.type}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.status}</Table.Cell>
                  <Table.Cell>
                    {moment(ele.updatedAt).format('Do, MMM hh:mm a')}
                  </Table.Cell>
                  <Table.Cell>{ele.txnRef}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button
                      positive={ele.status !== 'COMPLETE'}
                      fluid
                      icon
                      onClick={this.handleEdit.bind(this, ele)}
                    >
                      <Icon name="edit" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    );
  }
}
export default connect(s => ({ transactions: s.transactionJobs }))(
  TransactionJobContainer
);
