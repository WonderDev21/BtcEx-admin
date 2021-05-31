import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Message,
  Button,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Controlled as CodeMirror } from 'react-codemirror2';
import asyncActions from '../actions/asyncActions';
import AppConstants from '../constants/AppConstants';

class TransactionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txnObj: null,
    };
  }
  componentDidMount() {
    this.props.dispatch(asyncActions.fetchAllTransactions());
  }
  handleRequestChange(e, f) {
    const that = this;
    that.setState({
      notification: _.assign({}, that.state.notification, {
        [f.name]: f.value,
      }),
    });
  }
  handleStatusChange(e, f) {
    this.setState({
      txnObj: _.assign({}, this.state.txnObj, { status: f.value }),
    });
  }
  handleEdit(ele) {
    this.setState({ txnObj: ele });
  }
  onCancel() {
    this.setState({ txnObj: null });
  }
  processTransaction(txnObj) {
    const tid = txnObj.transactionId;
    if (txnObj.currency === AppConstants.baseCurrency) {
      this.props
        .dispatch(asyncActions.processINRWithdrawals(tid))
        .then(() => this.props.dispatch(asyncActions.fetchTransaction(tid)));
    } else {
      this.props
        .dispatch(asyncActions.processCoinWithdrawals(tid))
        .then(() => this.props.dispatch(asyncActions.fetchTransaction(tid)));
    }
  }
  render() {
    const that = this;
    const { transactions } = that.props;
    const { txnObj } = that.state;
    return (
      <div style={{ padding: '0.5em', marginTop: '2em' }}>
        {txnObj ? (
          <div className="edit-object">
            <Form>
              <Form.Group style={{ float: 'right' }}>
                <Form.Button error onClick={this.onCancel.bind(this)}>
                  Back
                </Form.Button>
                <Form.Button
                  disabled={txnObj.type === 'ADD_TO_PLATFORM'}
                  primary
                  onClick={that.processTransaction.bind(that, txnObj)}
                >
                  Process
                </Form.Button>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Customer ID</label>
                  <span>{txnObj.customerId}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Currency</label>
                  <span>{txnObj.currency}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Amount</label>
                  <span>{txnObj.amount}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Address</label>
                  <span>{txnObj.address}</span>
                </Form.Field>
                {txnObj.tag && (
                  <Form.Field inline>
                    <label>Tag</label>
                    <span>{txnObj.tag}</span>
                  </Form.Field>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Type</label>
                  <span>{txnObj.type}</span>
                </Form.Field>
                <Form.Field inline>
                  <label>Transaction ID</label>
                  <span>{txnObj.transactionId}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Status</label>
                  <Dropdown
                    selection
                    value={txnObj.status}
                    options={[
                      { key: 'PENDING', value: 'PENDING', text: 'PENDING' },
                      { key: 'DECLINED', value: 'DECLINED', text: 'DECLINED' },
                      { key: 'DEFERRED', value: 'DEFERRED', text: 'DEFERRED' },
                      { key: 'COMPLETE', value: 'COMPLETE', text: 'COMPLETE' },
                      {
                        key: 'CANCELLED',
                        value: 'CANCELLED',
                        text: 'CANCELLED',
                      },
                    ]}
                    onChange={(e, f) => onChangeEdit('status', f.value)}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field width={16}>
                  <label>Tranasaction Info</label>
                  <CodeMirror
                    className="codemirror"
                    value={JSON.stringify(txnObj.transactionInfo)}
                    options={{
                      mode: { name: 'javascript', json: true },
                      theme: 'material',
                      lineNumbers: true,
                    }}
                    onBeforeChange={(editor, data, value) => {}}
                    onChange={(editor, data, value) => {}}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </div>
        ) : (
          <Table compact size="small" striped fixed celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">
                  CustomerID
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Currency</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Amt</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Address</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  updatedAt
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(transactions, (ele, key) => (
                <Table.Row key={key}>
                  <Table.Cell>{ele.customerId}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.currency}</Table.Cell>
                  <Table.Cell textAlign="right">{ele.amount}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {ele.address || '-'}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {ele.type === 'ADD_TO_PLATFORM' ? 'ADD' : 'WITHDRAW'}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{ele.status}</Table.Cell>
                  <Table.Cell>
                    {moment(ele.updatedAt).format('Do, MMM HH:MM a')}
                  </Table.Cell>
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
export default connect(s => ({ transactions: s.transactions }))(
  TransactionContainer
);
/*

          
           */
