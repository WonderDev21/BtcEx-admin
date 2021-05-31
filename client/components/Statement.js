import React, { Component } from 'react';
import moment from 'moment';
import { Table, Button, Dropdown } from 'semantic-ui-react';
import AppConstants from '../constants/AppConstants';

const options = Object.keys(AppConstants.supportedCurrencies).map(ob => ({
  text: ob,
  key: ob,
  value: ob,
}));
class Statement extends Component {
  constructor() {
    super();
    const that = this;
    that.state = {
      currency: AppConstants.baseCurrency,
    };
  }
  handleChange(e, f) {
    this.setState({ currency: f.value });
  }
  render() {
    const that = this;
    const { currency } = that.state;
    const statements = (that.props.statements || []).filter(
      st => st.currency === currency
    );
    return (
      <div>
        <div>
          <Button onClick={that.props.goBack.bind(that)}>BACK</Button>
          <Dropdown
            selection
            options={options}
            value={currency}
            onChange={that.handleChange.bind(that)}
          />
        </div>
        <Table compact size="small" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>TxnRef No.</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Opening</Table.HeaderCell>
              <Table.HeaderCell>Deposit</Table.HeaderCell>
              <Table.HeaderCell>Withdrawal</Table.HeaderCell>
              <Table.HeaderCell>Closing</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {statements.map(strow => (
              <Table.Row key={strow.refNo}>
                <Table.Cell>{moment(strow.updatedAt).format('lll')}</Table.Cell>
                <Table.Cell>{strow.remarks}</Table.Cell>
                <Table.Cell>{strow.refNo}</Table.Cell>
                <Table.Cell>{strow.status}</Table.Cell>
                <Table.Cell>{strow.openingBalance}</Table.Cell>
                <Table.Cell>{`${
                  strow.txnType === 'DEPOSIT'
                    ? `${strow.transactionAmount} ${strow.currency}`
                    : '-'
                }`}</Table.Cell>
                <Table.Cell>{`${
                  strow.txnType === 'WITHDRAWAL'
                    ? `${strow.transactionAmount} ${strow.currency}`
                    : '-'
                }`}</Table.Cell>
                <Table.Cell>{strow.closingBalance}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
export default Statement;
