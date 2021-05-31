import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tab, Form, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import asyncJobActions from '../actions/asyncJobActions';
import AppConstants from '../constants/AppConstants';

const { activeTokens } = AppConstants;
const options = Object.keys(AppConstants.supportedCurrencies).map(ob => ({
  text: ob,
  key: ob,
  value: ob,
}));

class CoinDeposits extends Component {
  constructor() {
    super();
    const that = this;
    that.state = {
      currency: AppConstants.baseCurrency,
    };
  }
  componentDidMount() {
    this.props.dispatch(asyncJobActions.getStatus());
  }
  handleCurrencyChange(e, f) {
    this.setState({ currency: f.value });
  }
  listenToServer() {
    const that = this;
    const accounts = _.filter(that.props.accounts, ac => ac && ac.address);
    const nonINRAccounts = _.filter(
      accounts,
      ac => !!activeTokens[ac.currency]
    );
    const address = _.map(nonINRAccounts, ac => ({
      address: ac.address,
      currency: ac.currency,
    }));
    that.props.dispatch(asyncJobActions.startListener({ address }));
  }
  stopListener() {
    const that = this;
    that.props.dispatch(asyncJobActions.stopListener());
  }
  render() {
    const that = this;
    const { accounts, wallets, app } = that.props;
    const { currency } = that.state;
    const accountGroups = _.groupBy(accounts, 'currency');
    const currencyAccounts = accountGroups[currency];
    const listenStatus = !!app.listenerStatus[currency]; // Object.keys(app.listenerStatus || []).reduce((p, c) => p && app.listenerStatus[c],true);
    const totalVirtualBalance = currencyAccounts.reduce(
      (p, c) => p + parseFloat(c.value),
      0
    );
    const currencyWallets = _.groupBy(wallets, 'currency');
    const totalRealBalance = Object.keys(
      currencyWallets[currency] || {}
    ).reduce((p, c) => p + parseFloat(currencyWallets[currency][c].amount), 0);
    return (
      <div style={{ padding: '0.5em', marginTop: '2em' }}>
        <Form>
          <Form.Group inline>
            <Form.Field>
              <label>Status</label>
              <span>
                {listenStatus ? (
                  <span style={{ color: 'green' }}>Active</span>
                ) : (
                  <span style={{ color: 'red' }}>Inactive</span>
                )}
              </span>
            </Form.Field>
            <Form.Field>
              <label>Total Virtual Balance</label>
              <span>{parseFloat(totalVirtualBalance).toFixed(4)}</span>
            </Form.Field>
            <Form.Field>
              <label>Total Real Balance</label>
              <span>{parseFloat(totalRealBalance).toFixed(4)}</span>
            </Form.Field>
            <Form.Field>
              <Dropdown
                selection
                onChange={that.handleCurrencyChange.bind(that)}
                options={options}
                value={currency}
              />
              <Button positive onClick={that.listenToServer.bind(that)}>
                Listen
              </Button>
              <Button negative onClick={that.stopListener.bind(that)}>
                Stop
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <Table fixed striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Virtual</Table.HeaderCell>
              <Table.HeaderCell>Real Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currencyAccounts.map(ac => (
              <Table.Row key={ac.id}>
                <Table.Cell>{_.get(ac, 'user.fullName', '')}</Table.Cell>
                <Table.Cell>{_.get(ac, 'user.email', '')}</Table.Cell>
                <Table.Cell>{ac.address}</Table.Cell>
                <Table.Cell textAlign="right">{ac.value}</Table.Cell>
                <Table.Cell textAlign="right">
                  {_.get(wallets, `${[ac.address]}.amount`, '-')}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
export default connect(s => ({ app: s.app, wallets: s.wallets }))(CoinDeposits);
